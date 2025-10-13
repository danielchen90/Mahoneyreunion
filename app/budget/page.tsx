import Navigation from "@/components/navigation"
import BudgetCalculatorSection from "@/components/budget-calculator-section"
import Footer from "@/components/footer"
import Image from "next/image"

export default function BudgetPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image - Orlando Shopping District */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/orlando-shopping-district.png"
          alt="Beautiful Orlando Shopping District"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-blue-900/55 to-slate-900/65" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <div className="pt-20">
          <BudgetCalculatorSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}
