"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from "lucide-react"
import ContactFormModal from "@/components/contact-form-modal"
import WhatsAppButton from "@/components/whatsapp-button"

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      category: "General Information",
      questions: [
        {
          question: "When and where is the Mahoney Family Reunion?",
          answer: "The reunion is July 29 - August 3, 2026 (Wednesday - Monday) at Solterra Resort in Orlando, Florida. It's a 6-day celebration with activities for all ages."
        },
        {
          question: "Who can attend the reunion?",
          answer: "All Mahoney family members, their spouses, children, and close family friends are welcome! We encourage everyone to bring their families and make it a multi-generational celebration."
        },
        {
          question: "What's included in the registration fee?",
          answer: (
            <>
              The registration deposit secures your spot and is applied as a credit toward your total accommodation costs. The registration covers a portion of the accommodation costs at our shared family vacation home. Final accommodation payment schedules will be provided later. All other expenses (flights, rental cars, activities, personal expenses) are your individual responsibility and can be estimated using our{" "}
              <Link href="/budget" className="text-cyan-300 hover:text-cyan-200 underline font-semibold">
                Budget Calculator
              </Link>{" "}
              tool.
            </>
          )
        },
        {
          question: "Is there a deadline to register?",
          answer: "We are currently collecting initial registration deposits to secure spots. The registration deposit deadline is December 1st, 2025. Final payment schedules and detailed itineraries will be shared at a later date. Register early to ensure your spot!"
        }
      ]
    },
    {
      category: "Accommodations",
      questions: [
        {
          question: "Where should I stay?",
          answer: (
            <>
              We will be staying together at one large vacation home that can accommodate up to 30 people. You can view the property listing here:{" "}
              <a
                href="https://www.vrbo.com/en-ca/cottage-rental/p4478728vb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 underline font-semibold"
              >
                VRBO Property Listing
              </a>
              . Registering early and securing your spot is essential for planning purposes—this is a shared family home experience where we'll all be together under one roof!
            </>
          )
        },
        {
          question: "What if I need accessible accommodations?",
          answer: "Please indicate any accessibility needs during registration so we can ensure your comfort throughout the reunion. Contact the Reunion Planning Committee to discuss specific requirements."
        }
      ]
    },
    {
      category: "Activities & Events",
      questions: [
        {
          question: "What activities are planned?",
          answer: "We have family olympics, pool parties, BBQ dinners, live music, family tree presentations, storytelling sessions, and optional Disney World group visits. There's something for every age group!"
        },
        {
          question: "Are children's activities included?",
          answer: "Yes! We have age-appropriate activities for toddlers, kids, and teens. Our vacation home has a private pool and plenty of space for family activities. The Solterra Resort community also offers amenities like playgrounds and pools."
        },
        {
          question: "What about dietary restrictions?",
          answer: "We can accommodate most dietary needs including vegetarian, vegan, gluten-free, and common allergies. Please specify any restrictions during registration."
        },
        {
          question: "Can I skip some events?",
          answer: "Of course! While we hope you'll join most activities, attendance is flexible. You're free to explore Orlando, relax at the vacation home, or spend time with family as you prefer."
        }
      ]
    },
    {
      category: "Travel & Transportation",
      questions: [
        {
          question: "How do I get to Orlando?",
          answer: "Orlando International Airport (MCO) is about 30 minutes away. If driving, our vacation home has free parking and is easily accessible from I-4. Rental cars are recommended for getting around Orlando and to/from the airport."
        },

        {
          question: "What's the weather like in late July?",
          answer: "Orlando in late July is hot and humid with average highs of 92°F and lows of 75°F. Afternoon thunderstorms are common. Pack light, breathable clothing and don't forget sunscreen!"
        },
        {
          question: "Should I rent a car?",
          answer: (
            <>
              Yes, a rental car is highly recommended! You'll need transportation to get from the airport to our vacation home and for exploring Orlando attractions like Disney World, Universal Studios, and other activities. Check out our{" "}
              <Link href="/travel" className="text-cyan-300 hover:text-cyan-200 underline font-semibold">
                Travel Information page
              </Link>{" "}
              for rental car company options. Consider coordinating with family members to share rental costs.
            </>
          )
        }
      ]
    },
    {
      category: "Costs & Payment",
      questions: [
        {
          question: "How much will the reunion cost?",
          answer: "Total estimated accommodation cost is approximately $350 CAD per person (approximately $260 USD per person). IMPORTANT: Couples are charged per person (e.g., a couple pays $700 CAD total, not $350 CAD for both). The registration deposit is $100 CAD (due December 1st, 2025) and will be applied toward your remaining accommodation balance. Shared food cost is approximately $75 CAD per person (will be collected later along with remaining accommodation costs). Use our Budget Calculator to estimate your total trip costs including flights, activities, and personal expenses."
        },
        {
          question: "What payment methods do you accept?",
          answer: (
            <>
              You can make payments directly on our{" "}
              <Link href="/register" className="text-cyan-300 hover:text-cyan-200 underline font-semibold">
                Registration page
              </Link>{" "}
              via PayPal. Payment arrangements can also be made by contacting our Budget Director. The $100 CAD registration deposit secures your spot and is due by December 1st, 2025. Final payment schedules will be provided later.
            </>
          )
        },
        {
          question: "Is there a payment plan available?",
          answer: "Yes! Payment arrangements and schedules can be discussed with our Budget Director. We want to make this reunion accessible for all family members, so please reach out to discuss options that work for your situation."
        },
        {
          question: "What's your cancellation policy?",
          answer: "Cancellation policies can be discussed with the Reunion Planning Committee. We understand that circumstances change and will work with families on a case-by-case basis. Please contact us as soon as possible if you need to cancel or modify your registration."
        }
      ]
    }
  ]

  return (
    <section id="faq" className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/tropical-palm-trees-sunset-beach-florida-resort-pa.jpg')`,
        }}
      />
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <HelpCircle className="w-16 h-16 text-cyan-300 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="section-title text-white mb-4 drop-shadow-lg">Frequently Asked Questions</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty drop-shadow-md">
            Find answers to common questions about the Mahoney Family Reunion in Orlando, Florida.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/30 pb-3 drop-shadow-lg">
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <Card key={faqIndex} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/20">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full p-4 text-left hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-white pr-4 drop-shadow-md">
                            {faq.question}
                          </h4>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-white/70 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-white/70 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="border-t border-white/20 pt-4">
                            <p className="text-white/90 leading-relaxed drop-shadow-md">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-lg">Still Have Questions?</h3>
            <p className="text-white/90 mb-6 drop-shadow-md">
              Can't find what you're looking for? We're here to help make your reunion experience perfect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex items-center space-x-2 border-2 border-blue-400/50 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Us a Message</span>
              </Button>
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </section>
  )
}
