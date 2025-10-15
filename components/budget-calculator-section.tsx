"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calculator, DollarSign, Users, Plane, Car, Utensils, Camera, Download, RefreshCw, Home, UtensilsCrossed, Ticket, ChevronDown } from "lucide-react"

interface BudgetCalculation {
  accommodation: number
  food: number
  travel: number
  activities: number
  personalExpenses: number
  total: number
}

interface CurrencyRates {
  CAD_TO_USD: number
  USD_TO_CAD: number
}

export default function BudgetCalculatorSection() {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')
  const [travelMethod, setTravelMethod] = useState("flying")
  const [activities, setActivities] = useState<string[]>([])
  const [budget, setBudget] = useState<BudgetCalculation>({
    accommodation: 0,
    food: 0,
    travel: 0,
    activities: 0,
    personalExpenses: 0,
    total: 0
  })

  // Fixed exchange rates (you can update these or make them dynamic)
  const exchangeRates: CurrencyRates = {
    CAD_TO_USD: 0.74,
    USD_TO_CAD: 1.35
  }

  const convertPrice = (cadPrice: number): number => {
    return currency === 'USD' ? cadPrice * exchangeRates.CAD_TO_USD : cadPrice
  }

  const formatCurrency = (amount: number): string => {
    const symbol = currency === 'CAD' ? 'CAD' : 'USD'
    return `$${Math.round(amount)} ${symbol}`
  }

  // Collective costs (paid to reunion organizers)
  const collectiveCosts = {
    accommodation: 350, // CAD per person for Airbnb
    food: 75, // CAD per person for breakfasts and dinners
    deposit: 100 // CAD per person initial deposit
  }

  const travelOptions = [
    { id: "flying", name: "Flying to Orlando", basePrice: 400, description: "Round-trip flight from Canada + airport transfer" },
    { id: "driving", name: "Driving", basePrice: 400, description: "Gas, tolls, and parking for reunion duration" },
    { id: "train", name: "Train/Bus", basePrice: 300, description: "Train/bus ticket + local transport" }
  ]

  const activityOptions = [
    { id: "disney", name: "Disney World", price: 140, description: "1-day park ticket (individual cost)" },
    { id: "universal", name: "Universal Studios", price: 150, description: "1-day park ticket (individual cost)" },
    { id: "seaworld", name: "SeaWorld", price: 95, description: "1-day admission (individual cost)" },
    { id: "icon", name: "ICON Park", price: 40, description: "Observation wheel + attractions (individual cost)" },
    { id: "spa", name: "Resort Spa Services", price: 150, description: "Massage or spa treatment (individual cost)" },
    { id: "shopping", name: "Shopping & Souvenirs", price: 100, description: "Estimated shopping budget (individual cost)" }
  ]

  const personalExpenseOptions = [
    { id: "lunches", name: "Lunches & Snacks", price: 240, description: "6 days of lunches and snacks (not included in collective food cost)" },
    { id: "drinks", name: "Beverages & Alcohol", price: 150, description: "Personal drinks and alcoholic beverages" },
    { id: "tips", name: "Tips & Gratuities", price: 75, description: "Tips for services and activities" },
    { id: "emergency", name: "Emergency Fund", price: 100, description: "Unexpected expenses buffer" }
  ]

  useEffect(() => {
    calculateBudget()
  }, [adults, children, travelMethod, activities, currency])

  const calculateBudget = () => {
    const totalPeople = adults + children

    // Collective costs (paid to reunion organizers) - in CAD
    const accommodationCost = convertPrice(collectiveCosts.accommodation * totalPeople)
    const foodCost = convertPrice(collectiveCosts.food * totalPeople)

    // Individual expenses (estimates)
    const selectedTravel = travelOptions.find(t => t.id === travelMethod)
    const travelCost = convertPrice((selectedTravel?.basePrice || 600) * totalPeople)

    // Activities (individual responsibility)
    const activitiesCost = activities.reduce((total, activityId) => {
      const activity = activityOptions.find(a => a.id === activityId)
      return total + convertPrice((activity?.price || 0) * totalPeople)
    }, 0)

    // Personal expenses (lunches, drinks, tips, etc.)
    const personalExpensesCost = convertPrice(200 * totalPeople) // Base estimate for lunches/snacks

    const total = accommodationCost + foodCost + travelCost + activitiesCost + personalExpensesCost

    setBudget({
      accommodation: accommodationCost,
      food: foodCost,
      travel: travelCost,
      activities: activitiesCost,
      personalExpenses: personalExpensesCost,
      total: total
    })
  }

  const toggleActivity = (activityId: string) => {
    setActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    )
  }

  return (
    <section id="budget" className="min-h-screen relative py-20">
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Currency Toggle */}
        <div className="mb-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Budget Calculator
              </h2>
              <p className="text-xl text-white/90 max-w-3xl drop-shadow-md">
                Plan your reunion budget with our comprehensive calculator. Get estimates for both collective costs and individual expenses.
              </p>
            </div>

            {/* Currency Toggle */}
            <div className="flex-shrink-0">
              <div className="inline-flex rounded-lg bg-white/20 backdrop-blur-md p-0.5 border border-white/30">
                <button
                  onClick={() => setCurrency('CAD')}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currency === 'CAD'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  CAD $
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  USD $
                </button>
              </div>
            </div>
          </div>

          {/* Key Info Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-md border-2 border-cyan-400/50 rounded-full px-6 py-3 shadow-lg">
              <span className="text-white font-semibold drop-shadow-md">Initial Deposit: {formatCurrency(convertPrice(collectiveCosts.deposit))} per person</span>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 backdrop-blur-md border-2 border-orange-400/50 rounded-full px-6 py-3 shadow-lg">
              <span className="text-white font-semibold drop-shadow-md">Due: December 1st, 2025</span>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Inputs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-md border border-white/30 p-1">
                <TabsTrigger value="calculator" className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="breakdown" className="text-white data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                  Cost Breakdown
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculator" className="space-y-6 mt-6">
                {/* Family Size */}
                <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">Family Size</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Adults (18+)</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 p-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-cyan-400/50 text-white shadow-lg"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-semibold text-white text-lg">{adults}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 p-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-cyan-400/50 text-white shadow-lg"
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-xs text-white/70 mt-1">Same cost as children</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Children (All Ages)</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-8 h-8 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/50 text-white shadow-lg"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-semibold text-white text-lg">{children}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/50 text-white shadow-lg"
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-xs text-white/70 mt-1">Same cost as adults</p>
                    </div>
                  </div>
                </Card>

                {/* Cost Categories Accordion */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden">
                  <Accordion type="single" collapsible defaultValue="collective" className="w-full">
                    {/* Collective Costs */}
                    <AccordionItem value="collective" className="border-white/20">
                      <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Home className="w-5 h-5 text-cyan-400" />
                            <span className="text-lg font-semibold text-white">Collective Costs (Paid to Organizers)</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-cyan-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-cyan-400/50 rounded-lg p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-white drop-shadow-md">Airbnb Accommodation</span>
                              <span className="text-lg font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(collectiveCosts.accommodation))}/person</span>
                            </div>
                            <p className="text-sm text-white/90 drop-shadow-md">Shared Airbnb for the entire reunion duration</p>
                          </div>

                          {/* Accommodation Cost Disclaimer */}
                          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/60 rounded-lg p-4 shadow-lg backdrop-blur-sm">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <svg className="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-amber-100 mb-2 drop-shadow-md">Important: Accommodation Cost Notice</h4>
                                <p className="text-sm text-white/95 leading-relaxed drop-shadow-md">
                                  Current accommodation costs are calculated based on <strong>20-person attendance</strong>. If fewer family members register, the cost per person will increase proportionally. This is why <strong>early registration is essential</strong> - it helps us provide accurate final pricing and ensures the best rates for everyone.
                                </p>
                                <p className="text-sm text-amber-100 mt-2 font-medium drop-shadow-md">
                                  💡 We encourage timely registration to lock in these projected costs and avoid last-minute price adjustments.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-blue-400/50 rounded-lg p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-white drop-shadow-md">Shared Food</span>
                              <span className="text-lg font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(collectiveCosts.food))}/person</span>
                            </div>
                            <p className="text-sm text-white/90 drop-shadow-md">Breakfasts and dinners for all reunion days</p>
                            <p className="text-xs text-white/80 mt-1 drop-shadow-md">⚠️ Lunches and snacks NOT included</p>
                          </div>

                          <div className="bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-orange-400/50 rounded-lg p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-white drop-shadow-md">Initial Deposit</span>
                              <span className="text-lg font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(collectiveCosts.deposit))}/person</span>
                            </div>
                            <p className="text-sm text-white/90 drop-shadow-md">Due December 1st, 2025</p>
                            <p className="text-xs text-white/80 mt-1 drop-shadow-md">Credited toward accommodation cost</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Travel */}
                    <AccordionItem value="travel" className="border-white/20">
                      <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Plane className="w-5 h-5 text-purple-400" />
                            <span className="text-lg font-semibold text-white">Travel (Individual Expense)</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-purple-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-sm text-white/80 mb-4">Select your travel method for budget estimation:</p>
                        <div className="space-y-3">
                          {travelOptions.map((travel) => (
                            <label
                              key={travel.id}
                              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all shadow-md ${
                                travelMethod === travel.id
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 border-2 border-purple-300 shadow-lg shadow-purple-500/50'
                                  : 'bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-indigo-500/30 hover:border-purple-400/50'
                              }`}
                            >
                              <input
                                type="radio"
                                id={travel.id}
                                name="travelMethod"
                                checked={travelMethod === travel.id}
                                onChange={() => setTravelMethod(travel.id)}
                                className="w-4 h-4 text-purple-600"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-white">{travel.name}</div>
                                    <div className="text-sm text-white/70">{travel.description}</div>
                                  </div>
                                  <div className="text-lg font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(travel.basePrice))}/person</div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Activities */}
                    <AccordionItem value="activities" className="border-white/20">
                      <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Ticket className="w-5 h-5 text-orange-400" />
                            <span className="text-lg font-semibold text-white">Activities (Individual Expense)</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-orange-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-sm text-white/80 mb-4">Select activities you're considering:</p>
                        <div className="space-y-3">
                          {activityOptions.map((activity) => (
                            <label
                              key={activity.id}
                              className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all shadow-md ${
                                activities.includes(activity.id)
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-orange-300 shadow-lg shadow-orange-500/50'
                                  : 'bg-white/10 border border-white/20 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-amber-500/30 hover:border-orange-400/50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={activity.id}
                                checked={activities.includes(activity.id)}
                                onChange={() => toggleActivity(activity.id)}
                                className="w-4 h-4 text-orange-600 rounded"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-white">{activity.name}</div>
                                    <div className="text-sm text-white/70">{activity.description}</div>
                                  </div>
                                  <div className="text-lg font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(activity.price))}/person</div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Personal Expenses */}
                    <AccordionItem value="personal" className="border-white/20">
                      <AccordionTrigger className="px-6 py-4 hover:bg-white/5">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <UtensilsCrossed className="w-5 h-5 text-pink-400" />
                            <span className="text-lg font-semibold text-white">Personal Expenses (Estimates)</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-pink-400 transition-transform duration-200 data-[state=open]:rotate-180" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-sm text-white/80 mb-4">Estimated costs not included in collective expenses:</p>
                        <div className="space-y-3">
                          {personalExpenseOptions.map((expense) => (
                            <div key={expense.id} className="bg-gradient-to-r from-pink-500/30 to-rose-500/30 border border-pink-400/50 rounded-lg p-3 shadow-md hover:from-pink-500/40 hover:to-rose-500/40 transition-all">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-white">{expense.name}</span>
                                <span className="text-sm font-semibold text-white drop-shadow-lg">{formatCurrency(convertPrice(expense.price))}/person</span>
                              </div>
                              <p className="text-xs text-white/80">{expense.description}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500 to-amber-500 border-2 border-yellow-400/50 rounded-lg shadow-md">
                          <p className="text-sm text-white drop-shadow-md">
                            <strong>Note:</strong> The calculator includes a base estimate for lunches/snacks.
                            Adjust based on your needs.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </TabsContent>

              {/* Cost Breakdown Tab */}
              <TabsContent value="breakdown" className="space-y-6 mt-6">
                <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl">
                  <h3 className="text-xl font-semibold text-white mb-6">Detailed Cost Breakdown</h3>

                  {/* Collective Costs Summary */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Collective Costs (Paid to Organizers)
                    </h4>
                    <div className="space-y-2 pl-7">
                      <div className="flex justify-between text-white/90">
                        <span>Accommodation ({adults + children} people)</span>
                        <span className="font-semibold">{formatCurrency(budget.accommodation)}</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>Shared Food ({adults + children} people)</span>
                        <span className="font-semibold">{formatCurrency(budget.food)}</span>
                      </div>
                      <div className="flex justify-between text-cyan-300 font-semibold pt-2 border-t border-white/20">
                        <span>Collective Subtotal</span>
                        <span>{formatCurrency(budget.accommodation + budget.food)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Individual Expenses Summary */}
                  <div>
                    <h4 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Plane className="w-5 h-5" />
                      Individual Expenses (Your Responsibility)
                    </h4>
                    <div className="space-y-2 pl-7">
                      <div className="flex justify-between text-white/90">
                        <span>Travel ({adults + children} people)</span>
                        <span className="font-semibold">{formatCurrency(budget.travel)}</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>Activities ({activities.length} selected)</span>
                        <span className="font-semibold">{formatCurrency(budget.activities)}</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>Personal Expenses (Est.)</span>
                        <span className="font-semibold">{formatCurrency(budget.personalExpenses)}</span>
                      </div>
                      <div className="flex justify-between text-orange-300 font-semibold pt-2 border-t border-white/20">
                        <span>Individual Subtotal</span>
                        <span>{formatCurrency(budget.travel + budget.activities + budget.personalExpenses)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Budget Summary Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/30 shadow-xl sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Budget Summary</h3>
              </div>

              <div className="space-y-4">
                {/* Total People */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Total People</span>
                    <span className="text-2xl font-bold text-white">{adults + children}</span>
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    {adults} {adults === 1 ? 'adult' : 'adults'} + {children} {children === 1 ? 'child' : 'children'}
                  </div>
                </div>

                {/* Collective Costs */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-cyan-400/50 rounded-lg p-4 shadow-lg">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2 drop-shadow-md">
                    <Home className="w-4 h-4" />
                    Collective Costs
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 drop-shadow-md">Accommodation</span>
                      <span className="font-semibold text-white drop-shadow-md">{formatCurrency(budget.accommodation)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 drop-shadow-md">Shared Food</span>
                      <span className="font-semibold text-white drop-shadow-md">{formatCurrency(budget.food)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/30">
                      <span className="font-medium text-white drop-shadow-md">Subtotal</span>
                      <span className="font-bold text-white drop-shadow-lg">{formatCurrency(budget.accommodation + budget.food)}</span>
                    </div>
                  </div>
                </div>

                {/* Individual Expenses */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-orange-400/50 rounded-lg p-4 shadow-lg">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2 drop-shadow-md">
                    <Plane className="w-4 h-4" />
                    Individual Expenses
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 drop-shadow-md">Travel</span>
                      <span className="font-semibold text-white drop-shadow-md">{formatCurrency(budget.travel)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 drop-shadow-md">Activities</span>
                      <span className="font-semibold text-white drop-shadow-md">{formatCurrency(budget.activities)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/90 drop-shadow-md">Personal (Est.)</span>
                      <span className="font-semibold text-white drop-shadow-md">{formatCurrency(budget.personalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/30">
                      <span className="font-medium text-white drop-shadow-md">Subtotal</span>
                      <span className="font-bold text-white drop-shadow-lg">{formatCurrency(budget.travel + budget.activities + budget.personalExpenses)}</span>
                    </div>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 border-2 border-purple-400/50 rounded-lg p-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white drop-shadow-lg">Total Budget</span>
                    <span className="text-3xl font-bold text-white drop-shadow-lg">{formatCurrency(budget.total)}</span>
                  </div>
                  <p className="text-xs text-white/90 mt-2 drop-shadow-md">For {adults + children} {adults + children === 1 ? 'person' : 'people'}</p>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-blue-400/50 rounded-lg shadow-lg">
                <h4 className="font-semibold text-white mb-3 drop-shadow-md">Payment Schedule</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 drop-shadow-md">Initial Deposit</span>
                    <span className="font-semibold text-white drop-shadow-md">{formatCurrency(convertPrice(collectiveCosts.deposit))}/person</span>
                  </div>
                  <p className="text-sm text-white/90 drop-shadow-md">Due: December 1st, 2025</p>
                  <p className="text-xs text-white/80 drop-shadow-md">Credited toward accommodation</p>
                  <div className="mt-3 pt-3 border-t border-white/30">
                    <p className="text-sm text-white/90 drop-shadow-md">📅 Food payment schedule coming soon!</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:via-orange-700 hover:to-amber-700 text-white font-bold py-6 text-lg shadow-2xl shadow-orange-500/50 border-2 border-orange-400/50 hover:border-orange-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/70">
                  Register Now - Pay Deposit
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Budget Estimate</span>
                </Button>
              </div>

              {/* Info Note */}
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500 to-amber-500 border-2 border-yellow-400/50 rounded-lg shadow-md">
                <p className="text-xs text-white drop-shadow-md text-center">
                  💡 <strong>Remember:</strong> Individual expenses (travel, activities, lunches) are your responsibility.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
