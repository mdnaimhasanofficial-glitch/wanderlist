import CallToAction from "@/components/call-to-action"
import FeaturedDestinations from "@/components/featured-destinations"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import SiteFooter from "@/components/site-footer"
import Testimonials from "@/components/testimonials"
import WhyChoose from "@/components/why-choose"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedDestinations />
        <WhyChoose />
        <Testimonials />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  )
}
