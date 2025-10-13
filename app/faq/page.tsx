import Navigation from "@/components/navigation"
import FAQSection from "@/components/faq-section"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"

export default function FAQPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ShaderBackground />
      <div className="relative z-10">
        <Navigation />
        <div className="pt-20">
          <FAQSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}
