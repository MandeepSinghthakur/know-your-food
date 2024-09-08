"use client";

import { useState, useRef } from "react";

export interface ImageUploadProps {
  setImageFile: (fileName: File | null) => void;
  setImageUrl: (fileNameUrl: string | null) => void;
  setIngredients:(ingredients: []| null)=> void;
  setFoodName:(foodName: string | null) => void;
}
export default function ImageUpload({
  setImageFile,
  setImageUrl,
  setIngredients,
  setFoodName,
}: ImageUploadProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }

    // Reset previous data and set new file
    setIngredients([]);
    setFoodName(null);
    setImageFile(file);

    // Read the file as Data URL to display the image preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      //@ts-ignore
      setImageUrl(event.target.result);
      setLoading(false);
    };
    reader.onerror = () => {
      console.error("Error reading the file");
      setLoading(false);
    };
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 text-white rounded-lg transition duration-300 flex items-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Upload Image
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className={`px-4 py-2 text-white rounded-lg transition duration-300 flex items-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          Take Photo
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment" // Opens the camera app with the back camera
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
