import React, { useEffect, useState } from 'react';
import { fetchCommandes } from '../store/orderStore';

const HomeUser = () => {
  const [sentCommandes, setSentCommandes] = useState([]);
  const [pendingCommandes, setPendingCommandes] = useState([]);
  const [deniedCommandes, setDeniedCommandes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token'); // Get token from local storage
    if (!token) {
      setError("Authentication token not found!");
      return;
    }

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
    </div>
  );
};

export default HomeUser;
