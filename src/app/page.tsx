import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage () {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <Hero />
                <Services />
                <About />
                <Testimonials />
                <Pricing />
                <FAQ />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}