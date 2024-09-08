'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

const unitConversions = {
  'cup': 240,
  'oz': 29.5735,
};

export default function EnhancedFoodIdentifier() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [foodName, setFoodName] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [calorieInfos, setCalorieInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calorieLoading, setCalorieLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const newTotalCalories = calorieInfos.reduce((sum, info) => sum + info.calories, 0);
    setTotalCalories(newTotalCalories);
  }, [calorieInfos]);


  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    const updatedCalorieInfos = calorieInfos.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    setCalorieInfos(updatedCalorieInfos);
  };

  const handleQuantityChange = (index, newQuantity, newUnit) => {
    let updatedQuantity = newQuantity
    if(isNaN(updatedQuantity) || !updatedQuantity) {
      updatedQuantity = 0.1;
    };
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], quantity: updatedQuantity, unit: newUnit };

    // Convert quantity to ml (for standardization)
    const quantityInMl = updatedQuantity * (unitConversions[newUnit] || 1);

    // Recalculate calories based on updated quantity without API call
    const updatedCalorieInfos = calorieInfos.map((info, i) => ({
      ...info,
      calories: (info.calories / (ingredients[i].quantity * (unitConversions[ingredients[i].unit] || 1))) * quantityInMl,
    }));


    setIngredients(updatedIngredients);
    setCalorieInfos(updatedCalorieInfos);
    const newTotalCalories = updatedCalorieInfos.reduce((sum, info) => sum + info.calories, 0);
    setTotalCalories(newTotalCalories);
  };

  const handleCalorieFetch = async () => {
    setCalorieLoading(true);
    try {
      const calorieData = await Promise.all(
        ingredients.map(async ({ name, quantity, unit }) => {
          const promptText = `Provide the calorie information for the ingredient ${name} with approx quantity of ${quantity} ${unit ? unit + ' in units' : 'cup'}`;
          const response = await axios.post('/api/getCalorieInfo', { promptText });
          return { ingredient: name, calories: response.data.calorieInfo[name]};
        })
      );
      setCalorieInfos(calorieData);
    } catch (error) {
      console.error('Error fetching calorie information:', error);
    } finally {
      setCalorieLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const imageBase64 = await toBase64(imageFile);
      const response = await axios.post('/api/identify', { imageBase64 });
      setIngredients(response.data.ingredients.map(ingredient => ({ name: ingredient, quantity: 1 })));
      console.log(response.data);
      setFoodName(response.data.foodName)
      setCalorieInfos([]);
      setTotalCalories(0);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-auto">      
      <div className="flex justify-center mb-6 gap-4">
        <ImageUpload setImageFile ={setImageFile} setImageUrl={setImageUrl}/>
      </div>

      {imageUrl && (
        <div className="mb-6">
          <img src={imageUrl} alt="Captured food" className="w-full rounded-lg shadow-md" />
        </div>
      )}

      {imageUrl && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAnalyze}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                Analyze Image
              </>
            )}
          </button>
        </div>
      )}

    {foodName && (
        <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
          <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">
            Probable Food:
          </h3>
          <p className="text-2xl sm:text-3xl text-center text-green-600 font-semibold capitalize">
            {foodName === 'soup' ? 'Some kind of soup' : foodName}
          </p>
        </div>
      )}

      {ingredients.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="text-2xl font-semibold mb-4">Probable Ingredients List:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Ingredient</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  {calorieInfos.length > 0 && <th className="px-4 py-2 text-left">Calories</th>}
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{ingredient.name}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={isNaN(ingredient.quantity) ? 0 : ingredient.quantity}
                        onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value), ingredient.unit)}
                        className="w-20 p-1 border rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={ingredient.unit}
                        onChange={(e) => handleQuantityChange(index, ingredient.quantity, e.target.value)}
                        className="p-1 border rounded-md"
                      >
                        <option value="cup">Cup</option>
                        <option value="oz">Ounce</option>
                      </select>
                    </td>
                    {calorieInfos.length > 0 && (
                      <td className="px-4 py-2">
                        {calorieInfos[index]?.calories.toFixed(2)} kcal
                      </td>
                    )}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteIngredient(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCalorieFetch}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center"
              disabled={calorieLoading}
            >
              {calorieLoading  ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Calories...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Get Calorie Information
                </>
              )}
            </button>
          </div>

          {calorieInfos.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">Calorie Distribution:</h4>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calorieInfos}>
                    <XAxis dataKey="ingredient" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#fbbf24" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold">Total Calories:</h4>
                <p className="text-2xl font-bold text-yellow-500">{totalCalories.toFixed(2)} kcal</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}