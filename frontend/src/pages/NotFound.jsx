import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-2xl rounded-xl">
        <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-500 mb-6">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/acceuil" 
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <Home className="mr-2" size={20} />
            Retour à l'accueil
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;