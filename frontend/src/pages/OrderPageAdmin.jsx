import React, { useState, useEffect } from "react";
import { fetchCommandes, addCommande, DeleteCommandeById, AcceptCommandeById } from "../store/orderStore";
import { getAllArticles, getArticleById } from "../store/ArticaleService";
import { getItemLineById, addItemLinee } from "../store/ItemLineService";

const CommandeManager = () => {
  const [commandes, setCommandes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articleData, setArticleData] = useState({});
  const [form, setForm] = useState({
    dateCommande: "",
    status: "Pending",
    dateLivraison: "",
    is_allowed: "false",
    ItemLines: [
      {
        _id: "",
        Articles: "",
        UnitPrice: 0,
        quantity: 0,
        Taxes: 0,
        UOM: "kg",
      },
    ],
    Suppliers: [],
  });
  const [showAddRow, setShowAddRow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth_token");

  // Load articles
  const loadArticles = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("You must be logged in to access this feature");
      const articlesData = await getAllArticles(token);
      setArticles(articlesData);
    } catch (err) {
      setError(err.message || "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch commandes
  const loadCommandes = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("You must be logged in to access this feature");
      const data = await fetchCommandes(token);
      setCommandes(data);
    } catch (err) {
      setError(err.message || "Error fetching commandes");
    } finally {
      setLoading(false);
    }
  };

  // Preload article data
  const preloadArticleData = async () => {
    const data = {};
    for (const commande of commandes) {
      if (Array.isArray(commande.ItemLines)) {
        const itemLineDetails = await Promise.all(
          commande.ItemLines.map((itemLineId) => fetchArticleAndQuantity(itemLineId))
        );
        data[commande._id] = itemLineDetails;
      } else {
        data[commande._id] = [];
      }
    }
    setArticleData(data);
  };

  // Fetch article and quantity for an ItemLine ID
  const fetchArticleAndQuantity = async (itemLineId) => {
    try {
      const itemLine = await getItemLineById(itemLineId, token);
      if (!itemLine || !itemLine.Articles) {
        throw new Error("Invalid data: itemLine or articles not found");
      }

      const article = await getArticleById(itemLine.Articles, token);
      if (!article) {
        throw new Error("Article not found");
      }

      return {
        article: article.name || "Article name not found",
        quantity: itemLine.quantity || "Quantity not found",
      };
    } catch (error) {
      console.error("Error fetching article/quantity:", itemLineId, error);
      return {
        article: "Error fetching article",
        quantity: "Error fetching quantity",
      };
    }
  };

  // Handle form submission to add a new commande
  const handleAddCommande = async () => {
    setError("");
    try {
      if (!form.dateCommande || !form.status || !form.dateLivraison) {
        throw new Error("Please fill in all required fields.");
      }

      const updatedItemLines = await Promise.all(
        form.ItemLines.map(async (item) => {
          const newItemLine = {
            Articles: item.Articles,
            UnitPrice: item.UnitPrice || 0,
            quantity: item.quantity || 0,
            Taxes: item.Taxes || 0,
            UOM: item.UOM || "kg",
            Totalprice: item.UnitPrice * (item.quantity || 0),
          };

          const savedItemLine = await addItemLine(newItemLine, token);

          if (!savedItemLine || !savedItemLine._id) {
            throw new Error(`Failed to save item line for article: ${item.Articles}`);
          }

          return { ...newItemLine, _id: savedItemLine._id };
        })
      );

      const newCommande = { ...form, ItemLines: updatedItemLines };
      await addCommande(newCommande, token);

      setForm({
        dateCommande: "",
        status: "",
        dateLivraison: "",
        ItemLines: [
          {
            Articles: "",
            UnitPrice: 0,
            quantity: 0,
            Taxes: 0,
            UOM: "kg",
            Totalprice: 0,
          },
        ],
        Suppliers: [],
      });

      setShowAddRow(false);
      await loadCommandes();
      alert("Commande added successfully!");
    } catch (err) {
      setError(err.message || "Error adding commande");
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCommandes();
    loadArticles();
  }, [token]);

  useEffect(() => {
    if (commandes.length > 0) {
      preloadArticleData();
    }
  }, [commandes]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Commande Manager</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Render commandes */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">All Commandes</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
  <thead className="bg-gray-200">
    <tr>
      <th className="px-4 py-2 text-left">Commande ID</th>
      <th className="px-4 py-2 text-left">Date Commande</th>
      <th className="px-4 py-2 text-left">Status</th>
      <th className="px-4 py-2 text-left">Date de Livraison</th>
      <th className="px-4 py-2 text-left">Articles</th>
      <th className="px-4 py-2 text-left">Quantities</th>
      <th className="px-4 py-2 text-left">Accepted</th>
      <th className="px-4 py-2 text-left">Actions</th>
      <th className="px-4 py-2 text-left">Delete</th>
    </tr>
  </thead>
  <tbody>
    {commandes.map((commande, index) => (
      <tr key={commande._id} className="border-t">
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{commande.dateCommande}</td>
        <td className="px-4 py-2">
          <span
            className={`font-semibold ${
              commande.status === "Sent"
                ? "text-green-500"
                : commande.status === "Pending"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {commande.status}
          </span>
        </td>
        <td className="px-4 py-2">{commande.dateLivraison}</td>
        <td className="px-4 py-2">
          {articleData[commande._id]?.map((item, index) => (
            <div key={index}>{item.article}</div>
          ))}
        </td>
        <td className="px-4 py-2">
          {articleData[commande._id]?.map((item, index) => (
            <div key={index}>{item.quantity}</div>
          ))}
        </td>
        <td className="px-4 py-2">{commande.is_allowed ? "Yes" : "No"}</td>
        <td className="px-4 py-2">
          {commande.status !== "Sent" && (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleAcceptCommande(commande._id)}
            >
              Accept
            </button>
          )}
        </td>
        <td className="px-4 py-2">
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteCommande(commande._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </section>
    </div>
  );
};

export default CommandeManager;
