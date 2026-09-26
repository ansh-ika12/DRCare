export default function Hero() {
  const stats = [
    { value: '< 1 min', label: 'Screening Time' },
    { value: '5', label: 'AI Generated Outputs' },
    { value: '0-4', label: 'DR Grading Scale' },
  ]

  return (
    <section id="home" className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 md:items-start">
      <div className="md:-translate-y-12 md:translate-x-[72px]">
        <div className="md:translate-y-4">
          <p className="uppercase tracking-widest text-sky font-semibold text-sm mb-4">AI Powered Diabetic Retinopathy Screening</p>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6">
            Early Detection <br /> Saves Sight
          </h1>
        </div>
        <p className="text-slate-600 text-lg mb-8 max-w-md">
          Upload a fundus photo to screen for diabetic retinopathy. DRCare AI checks image quality, grades disease severity, recommends follow up, and provides a visual explanation.
        </p>
        <div className="flex flex-wrap gap-4 mb-10">
          <a href="/screening" className="bg-navy text-white font-semibold px-7 py-3.5 rounded-full hover:bg-navy-dark transition-colors">
            Start Screening
          </a>
          <a href="#how-it-works" className="border border-navy text-navy font-semibold px-7 py-3.5 rounded-full hover:bg-sky-light transition-colors">
            See How It Works
          </a>
        </div>
        <div className="flex gap-10 md:-translate-y-2">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-2xl font-bold text-navy">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative md:-translate-y-12">
        <div className="rounded-3xl overflow-hidden bg-sky-light aspect-[4/5] max-w-md mx-auto">
          {/* See "Adding the image" note below the code for where this file comes from */}
          <img
            src="/images/ophthalmologist-hero.jpg"
            alt="Ophthalmologist reviewing a fundus screening result"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-20 -left-4 md:-left-10 bg-navy text-white rounded-2xl px-6 py-4 shadow-lg max-w-[220px]">
          <p className="font-heading font-bold text-lg">A clearer view of retinal health</p>
        </div>
      </div>
    </section>
  )
}