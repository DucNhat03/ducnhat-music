import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">
        Tailwind Test Component
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-white mb-4">
          This is a test component to check if Tailwind CSS is working properly.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TailwindTest; 