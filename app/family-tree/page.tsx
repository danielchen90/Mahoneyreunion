import Navigation from "@/components/navigation"
import FamilyTreeSection from "@/components/family-tree-section"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"

export default function FamilyTreePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ShaderBackground />
      <div className="relative z-10">
        <Navigation />
        <div className="pt-20">
          <FamilyTreeSection />
        </div>
        <Footer />
      </div>
    </main>
  )
}
