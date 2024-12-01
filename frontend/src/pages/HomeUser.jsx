import React, { useEffect, useState } from 'react';
import { fetchCommandes } from '../store/orderStore';
import { getAllArticles, addArticle } from "../store/ArticaleService";

const HomeUser = () => {
  const [sentCommandes, setSentCommandes] = useState([]);
  const [pendingCommandes, setPendingCommandes] = useState([]);
  const [deniedCommandes, setDeniedCommandes] = useState([]);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]); // Initialize as an array
  const [showAddArticle, setShowAddArticle] = useState(false); // Toggle form visibility
  const [newArticle, setNewArticle] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  

  useEffect(async () => {
    const token = localStorage.getItem('auth_token'); // Get token from local storage
    if (!token) {
      setError("Authentication token not found!");
      return;
    }
    const articlesRes = await getAllArticles();

        setArticles(Array.isArray(articlesRes) ? articlesRes : []);


    const fetchAndCategorizeCommandes = async () => {
      try {
        const commandes = await fetchCommandes(token); // Fetch commandes
        setSentCommandes(commandes.filter((commande) => commande.status === "Sent"));
        setPendingCommandes(commandes.filter((commande) => commande.status === "Pending"));
        setDeniedCommandes(commandes.filter((commande) => commande.status === "denied"));
      } catch (err) {
        setError(err.message || "Failed to load commandes");
      }
    };

    fetchAndCategorizeCommandes();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sent Commandes Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Commandes Sent</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">{sentCommandes.length}</p>
          <p className="text-gray-500 mt-1">Accepted Commandes and Sent to supplier.</p>
        </div>

        {/* Pending Commandes Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Pending Commandes</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{pendingCommandes.length}</p>
          <p className="text-gray-500 mt-1">Total Pending Commandes.</p>
        </div>

        {/* Denied Commandes Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Commandes Denied</h3>
          <p className="text-4xl font-bold text-red-500 mt-2">{deniedCommandes.length}</p>
          <p className="text-gray-500 mt-1">Total denied Commandes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {showAddArticle && (
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Article</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={newArticle.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 border rounded-md"
              />
              <textarea
                name="description"
                value={newArticle.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="price"
                value={newArticle.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                name="quantity"
                value={newArticle.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleSaveArticle}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                Save Article
              </button>
            </div>
          </div>
        )}

        {articles.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No articles found.</p>
        ) : (
          articles.map((article) => (
            <div
              key={article._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out"
            >
              <h3 className="text-lg font-semibold text-gray-700">{article.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{article.description}</p>
              <div className="flex justify-between mt-4">
                <span className="text-lg font-semibold text-gray-900">Price: ${article.price}</span>
                <span className="text-md text-gray-600">Qty: {article.quantity}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    
  );
};

export default HomeUser;
