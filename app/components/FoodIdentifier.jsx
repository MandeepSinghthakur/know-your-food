'use client'

import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'

export default function FoodIdentifier() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleCapture = async (e) => {
    const file = e.target.files[0]
    setImage(URL.createObjectURL(file))
  }

  const handleUpload = () => {
    fileInputRef.current.click()
  }

  const identifyFood = async () => {
    setLoading(true)
    try {
        const response = await fetch('/api/identify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image }),
       });
  
      if (!response.ok) {
        throw new Error('Failed to identify food')
      }
  
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error identifying food:', error)
      setResult({ error: 'Failed to identify food' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-l-lg hover:bg-blue-600 transition duration-300"
        >
          Upload Image
        </button>
        <label className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition duration-300 cursor-pointer">
          <Camera className="inline-block mr-2" />
          Capture Image
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            className="hidden"
          />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCapture}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {image && (
        <>
        <div className="mb-6">
          <img src={image} alt="Captured food" className="w-full rounded-lg" />
        </div>
        <div className="flex justify-center mb-6">
        <button
          onClick={identifyFood}
          className="bg-blue-500 text-white px-4 py-2 rounded-l-lg hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </div>
        </>
      )}

  

      {loading && <p className="text-center">Identifying food...</p>}

      {result && !loading && (
        <div>
          <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
          <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-6 mb-4">
            {result.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <p className="text-lg">
            <span className="font-semibold">Calories:</span> {result.calories}
          </p>
        </div>
      )}
    </div>
  )
}