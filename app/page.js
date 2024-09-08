import EnhancedFoodIdentifier from './components/FoodIdentifier'
import HowItWorks from './components/HowItWorks'
import AdComponent from './components/AdComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full bg-gradient-to-r from-blue-500 to-purple-500 lg:justify-center lg:p-24">
    <div className="w-full max-w-full lg:max-w-4xl px-4 lg:px-0">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center my-8">Know Your Food</h1>
      <EnhancedFoodIdentifier />
      <HowItWorks />
      <AdComponent slot="0987654321" />
    </div>
  </main>
  )
}