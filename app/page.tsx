import FoodIdentifier from './components/FoodIdentifier'
import HowItWorks from './components/HowItWorks'
import AdComponent from './components/AdComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-purple-500">
      <h1 className="text-4xl font-bold text-white mb-8">Know Your Food</h1>
      <FoodIdentifier />
      <HowItWorks/>
      <AdComponent slot="0987654321" />
    </main>
  )
}