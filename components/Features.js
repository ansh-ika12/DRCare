const features = [
  { title: 'Quality Check', desc: 'Poor quality images are rejected, borderline images are enhanced using contrast limited adaptive histogram equalization (CLAHE), and optimal images bypass enhancement.' },
  { title: 'DR Grading', desc: 'Classifies diabetic retinopathy severity on a 0-4 scale with a confidence percentage.' },
  { title: 'Referral Decision', desc: 'Translates the grade into a clear next step: refer to an ophthalmologist or routine follow up.' },
  { title: 'Structure Visualization', desc: 'Highlights vessels in red and bright lesion candidates in blue, directly on the image.' },
  { title: 'Grad-CAM Explainability', desc: 'A heatmap showing exactly what the model focused on to reach its grade, rather than acting as a black box.' },
  { title: 'Single Screen Results', desc: 'Every output appears together as soon as screening runs, for fast clinical review.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <p className="uppercase tracking-widest text-sky font-semibold text-sm mb-3">What You Get</p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy">
              One Screening, Six Outputs
            </h2>
          </div>
          <p className="text-slate-600">
            Every screening run returns a complete clinical picture, not just a grade, so the decision is easy to trust and explain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-lg transition-shadow">
              <h3 className="font-heading font-bold text-navy mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}