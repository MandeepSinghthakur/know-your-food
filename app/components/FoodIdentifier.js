'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import IngredientsComponent from './IngredientsComponent'

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
      <div className="w-full max-w-full lg:max-w-4xl">
        <div className="flex justify-center mb-6 gap-4 w-full">
          <ImageUpload setFoodName={setFoodName} setIngredients={setIngredients} setImageFile={setImageFile} setImageUrl={setImageUrl}/>
        </div>

        {imageUrl && (
          <div className="mb-6 w-full">
            <img src={imageUrl} alt="Captured food" className="w-full rounded-lg shadow-md" />
          </div>
        )}

        {imageUrl && (
          <div className="flex justify-center mb-6 w-full">
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
                  Analyze Food
                </>
              )}
            </button>
          </div>
        )}

        {foodName && (
          <div className="w-full my-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
            <h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">
              Probable Food:
            </h3>
            <p className="text-2xl sm:text-3xl text-center text-green-600 font-semibold capitalize">
              {foodName === 'soup' ? 'Some kind of soup' : foodName}
            </p>
          </div>
        )}
        
        <IngredientsComponent 
          ingredients={ingredients}
          className="w-full"
          calorieInfos={calorieInfos}
          handleQuantityChange={handleQuantityChange}
          handleDeleteIngredient={handleDeleteIngredient}
          handleCalorieFetch={handleCalorieFetch}
          calorieLoading={calorieLoading}
          totalCalories={totalCalories}
        />
      </div>
  );
}