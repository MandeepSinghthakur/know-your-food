import { Upload, Search, Info } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card 
          icon={<Upload />}
          title="Upload or Capture"
          description="Take a photo or upload an image of any food item you want to know about."
        />
        <Card 
          icon={<Search />}
          title="Identification"
          description="Our AI analyzes the image to identify the food item with high accuracy."
        />
        <Card 
          icon={<Info />}
          title="Get Results"
          description="Receive detailed information including the food name, ingredients, and estimated calories."
        />
      </div>
    </div>
  )
}

function Card({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}