const steps = [
  { number: '01', title: 'Upload Fundus Photo', desc: 'Clinician or technician uploads a retina image for screening.' },
  { number: '02', title: 'Quality Check', desc: 'Poor images are rejected, borderline images receive CLAHE enhancement, and optimal images bypass enhancement.' },
  { number: '03', title: 'AI Grading', desc: 'DR grade (0-4) with a confidence score is generated from the image.' },
  { number: '04', title: 'Explainable Visualization', desc: 'Structure map highlights vessels and lesions; Grad-CAM shows where the model focused.' },
  { number: '05', title: 'Referral Decision', desc: '"Refer to Ophthalmologist" or "Routine", with the clinical decision in under a second.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center uppercase tracking-widest text-sky font-semibold text-sm mb-3">Our Process</p>
        <h2 className="text-center font-heading text-3xl md:text-4xl font-extrabold text-navy mb-16">
          From Upload to Clinical Decision
        </h2>

        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="h-1 bg-sky rounded-full mb-6" />
              <div className="w-12 h-12 rounded-full bg-navy text-white font-heading font-bold flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="font-heading font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}