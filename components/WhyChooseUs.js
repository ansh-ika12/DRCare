const reasons = [
  { number: '01', title: 'Clinically Structured Grading', desc: 'Grades map to a standard 0-4 DR severity scale, not an opaque score.' },
  { number: '02', title: 'Explainable, Not a Black Box', desc: 'Grad-CAM and structure visualization show the evidence behind every grade.' },
  { number: '03', title: 'Fast by Design', desc: 'Quality check, grading, and referral decision all appear together in under a minute.' },
  { number: '04', title: 'Built for Screening at Scale', desc: 'Designed for high volume screening camps and community health settings.' },
]

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-navy py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="uppercase tracking-widest text-sky-light font-semibold text-sm mb-3">Why DRCare</p>
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-14 max-w-xl">
          Built for Trust at the Point of Screening
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {reasons.map((r) => (
            <div key={r.number} className="flex gap-5">
              <div className="w-11 h-11 shrink-0 rounded-full bg-sky text-navy font-heading font-bold flex items-center justify-center">
                {r.number}
              </div>
              <div>
                <h3 className="font-heading font-bold text-white mb-1">{r.title}</h3>
                <p className="text-sm text-slate-300">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}