import io
import base64
import numpy as np
import cv2
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from torchvision.models import efficientnet_b0
from skimage.filters import frangi
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
NUM_CLASSES = 5
GRADE_NAMES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]

# IMPORTANT: replace 0.5 with the actual "Recommended referral threshold"
# number your notebook printed during its final evaluation cell.
REFERRAL_THRESHOLD = 0.5

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

resize_transform = transforms.Resize((224, 224))
normalize_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

_model = None
_cam = None

def load_model(weights_path="drcare_model.pth"):
    global _model, _cam
    model = efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, NUM_CLASSES)
    model.load_state_dict(torch.load(weights_path, map_location=device))
    model.to(device)
    model.eval()
    _model = model
    _cam = GradCAM(model=model, target_layers=[model.features[-1]])
    return model

def check_quality(pil_img):
    img_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    brightness = gray.mean()

    if blur_score < 50:
        return False, f"Image too blurry (sharpness: {blur_score:.1f}). Please retake."
    if brightness < 40:
        return False, f"Image too dark (brightness: {brightness:.1f}). Please retake with better lighting."
    if brightness > 220:
        return False, f"Image overexposed (brightness: {brightness:.1f}). Please retake."
    return True, "Image quality OK."

def analyze_structures(pil_img_224):
    img = np.array(pil_img_224.resize((512, 512)))
    green = img[:, :, 1]

    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    green_eq = clahe.apply(green)

    vessel_map = frangi(green_eq.astype(float) / 255.0, sigmas=range(1, 4))
    vessel_map = (vessel_map - vessel_map.min()) / (vessel_map.max() - vessel_map.min() + 1e-8)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    tophat = cv2.morphologyEx(green_eq, cv2.MORPH_TOPHAT, kernel)
    _, lesion_mask = cv2.threshold(tophat, 15, 255, cv2.THRESH_BINARY)

    overlay = cv2.cvtColor(green_eq, cv2.COLOR_GRAY2RGB).astype(np.float32) / 255.0
    overlay[..., 0] = np.clip(overlay[..., 0] + vessel_map * 0.6, 0, 1)
    overlay[..., 2] = np.clip(overlay[..., 2] + (lesion_mask / 255.0) * 0.8, 0, 1)

    return (overlay * 255).astype(np.uint8)

def _to_base64_png(np_img):
    img = Image.fromarray(np_img)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

def predict_and_explain(pil_img):
    if _model is None:
        load_model()

    pil_img = pil_img.convert("RGB")
    resized = resize_transform(pil_img)

    ok, quality_msg = check_quality(resized)
    if not ok:
        return {
            "quality_ok": False,
            "quality_message": quality_msg,
            "grade": None,
            "referral_text": None,
            "structure_overlay": None,
            "gradcam_overlay": None,
        }

    structure_overlay = analyze_structures(resized)

    input_tensor = normalize_transform(resized).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = _model(input_tensor)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]

    predicted_grade = int(probs.argmax())
    confidence = float(probs[predicted_grade] * 100)
    referral_prob = float(probs[2] + probs[3] + probs[4])
    is_referable = referral_prob >= REFERRAL_THRESHOLD

    targets = [ClassifierOutputTarget(predicted_grade)]
    grayscale_cam = _cam(input_tensor=input_tensor, targets=targets)[0]
    rgb_img = np.array(resized).astype(np.float32) / 255.0
    cam_overlay = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    return {
        "quality_ok": True,
        "quality_message": quality_msg,
        "grade": predicted_grade,
        "grade_label": GRADE_NAMES[predicted_grade],
        "confidence": round(confidence, 1),
        "referable": is_referable,
        "referral_text": "REFER TO OPHTHALMOLOGIST" if is_referable else "Routine - no referral needed",
        "structure_overlay": _to_base64_png(structure_overlay),
        "gradcam_overlay": _to_base64_png(cam_overlay),
    }

def simulate_district_screening(patients_per_year=100000, work_days_per_year=300,
                                 seconds_per_screening=15, doctor_review_seconds=25,
                                 num_doctors=2, hours_per_day=8):
    patients_per_day = patients_per_year / work_days_per_year
    screening_capacity_per_day = (hours_per_day * 3600) / seconds_per_screening
    review_capacity_per_day = num_doctors * (hours_per_day * 3600) / doctor_review_seconds

    if review_capacity_per_day < patients_per_day:
        bottleneck = "Doctor review"
    elif screening_capacity_per_day < patients_per_day:
        bottleneck = "AI screening throughput"
    else:
        bottleneck = "None - system keeps up"

    doctors_needed = patients_per_day * doctor_review_seconds / (hours_per_day * 3600)

    return {
        "patients_per_day": round(patients_per_day, 1),
        "ai_capacity_per_day": round(screening_capacity_per_day, 1),
        "review_capacity_per_day": round(review_capacity_per_day, 1),
        "bottleneck": bottleneck,
        "doctors_needed": round(doctors_needed, 1),
    }