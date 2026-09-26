export default function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-300 py-14">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        <div>
          <p className="font-heading font-bold text-white text-xl mb-3">DRCare</p>
          <p className="text-sm max-w-xs">AI powered fundus image screening, quality checked, graded, and explained in one pass.</p>
        </div>

        <div className="flex gap-16 text-sm">
          <div>
            <p className="text-white font-semibold mb-3">Product</p>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#why-us" className="hover:text-white">Why DRCare</a></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 mt-10">© 2026 DRCare. For research and screening support use.</p>
    </footer>
  )
}