import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { getAllArticles, addArticle } from "../store/ArticaleService";

const HomePage = () => {
  const [stats, setStats] = useState({
    pendingApproval: 0,
    suppliers: 0,
    employees: 0,
  });
  const [articles, setArticles] = useState([]); // Initialize as an array
  const [showAddArticle, setShowAddArticle] = useState(false); // Toggle form visibility
  const [newArticle, setNewArticle] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, suppliersRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:5000/users", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("http://localhost:5000/supplier", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("http://localhost:5000/users", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);
        const articlesRes = await getAllArticles();

        setArticles(Array.isArray(articlesRes) ? articlesRes : []);

        setStats({
          pendingApproval: pendingRes.data.users.filter(
            (user) => !user.isAccessGranted
          ).length,
          suppliers: suppliersRes.data.length,
          employees: employeesRes.length,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user]);

  const handleAddArticleClick = () => {
    setShowAddArticle((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveArticle = async () => {
    try {
      await addArticle(newArticle, user?.token);
      const updatedArticles = await getAllArticles();
      setArticles(updatedArticles);
      setShowAddArticle(false);
      setNewArticle({ name: "", description: "", price: "", quantity: "" }); // Reset form
    } catch (err) {
      console.error("Error adding article:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">{stats.pendingApproval}</p>
          <p className="text-gray-500 mt-1">New accounts waiting for approval.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
          <h3 className="text-lg font-semibold text-gray-700">Suppliers</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">{stats.suppliers}</p>
          <p className="text-gray-500 mt-1">Total registered suppliers.</p>
        </div>
      </div>

      <button
        onClick={handleAddArticleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        {showAddArticle ? "Cancel" : "Add Article"}
      </button>

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

export default HomePage;
