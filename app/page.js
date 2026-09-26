import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}