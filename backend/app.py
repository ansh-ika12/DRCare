import io
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from pipeline import load_model, predict_and_explain, simulate_district_screening

app = FastAPI(title="DRCare / DRISHTI API")

# Allows your Next.js frontend to call this API from the browser.
# Once deployed, you can replace "*" with your actual frontend URL for tighter security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    load_model("drcare_model.pth")

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/screen")
async def screen(file: UploadFile = File(...)):
    image_bytes = await file.read()
    pil_img = Image.open(io.BytesIO(image_bytes))
    return predict_and_explain(pil_img)

@app.get("/simulate")
def simulate(patients_per_year: int = 100000, num_doctors: int = 2):
    return simulate_district_screening(
        patients_per_year=patients_per_year,
        num_doctors=num_doctors,
    )