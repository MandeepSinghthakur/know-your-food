import React from 'react';
import { Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const IngredientsComponent = ({ 
  ingredients, 
  calorieInfos, 
  handleQuantityChange, 
  handleDeleteIngredient, 
  handleCalorieFetch, 
  calorieLoading,
  totalCalories 
}) => {
  return (
    <>
      {ingredients.length > 0 && (
        <div className="mt-6 w-full px-4 sm:px-0" >
          <h3 className="text-2xl font-semibold mb-4">Probable Ingredients List:</h3>
          <div className="overflow-hidden">
            <div className="sm:hidden">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{ingredient.name}</span>
                    <button
                      onClick={() => handleDeleteIngredient(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={isNaN(ingredient.quantity) ? 0 : ingredient.quantity}
                      onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value), ingredient.unit)}
                      className="w-20 p-1 border rounded-md"
                    />
                    <select
                      value={ingredient.unit}
                      onChange={(e) => handleQuantityChange(index, ingredient.quantity, e.target.value)}
                      className="p-1 border rounded-md"
                    >
                      <option value="cup">Cup</option>
                      <option value="oz">Ounce</option>
                    </select>
                  </div>
                  {calorieInfos.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Calories: {calorieInfos[index]?.calories.toFixed(2)} kcal
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
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
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCalorieFetch}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center"
              disabled={calorieLoading}
            >
              {calorieLoading ? (
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
    </>
  );
};

export default IngredientsComponent;