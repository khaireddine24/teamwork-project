import React, { useState, useEffect } from "react";
import { fetchCommandes, addCommande,DeleteCommandeById,AcceptCommandeById } from "../store/orderStore";
import { getAllArticles,getArticleById } from "../store/ArticaleService";
import { getItemLineByArticle,getItemLineById,addItemLinee } from "../store/ItemLineService";
import { getAllSuppliers } from "../store/SupplierService";

const CommandeManager = () => {
  const [commandes, setCommandes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [articleData, setArticleData] = useState({});
  const [savedItemLine,setsavedItemLine]=useState()
  const [suppliers,setSuppliers]=useState();
  const [supplier,setSupplier]=useState();
  const [form, setForm] = useState({
    dateCommande: "",
    status: "Pending",
    dateLivraison: "",
    is_allowed:"false",
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
    Suppliers: "",
  });
  const [showAddRow, setShowAddRow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth_token");
 
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
  const loadSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("You must be logged in to access this feature");

      const SuppliersData = await getAllSuppliers(token);
      setSuppliers(SuppliersData);
    } catch (err) {
      setError(err.message || "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCommande = async (id) => {
    try {
      await DeleteCommandeById(id, token);  
      setCommandes((prevCommandes) =>
        prevCommandes.filter((commande) => commande._id !== id)
      );
      alert("Commande deleted successfully");
    } catch (err) {
      setError(err.message || "Error deleting commande");
    }
  };
  const handleAcceptCommande = async (id) => {
    try {
      await AcceptCommandeById(id, token);  // Call the delete function from your store
      // Remove the deleted commande from the state
      setCommandes((prevCommandes) =>
        prevCommandes.filter((commande) => commande._id !== id)
      );
      alert("Commande Accepted ");
    } catch (err) {
      setError(err.message || "Error Accepting commande");
    }
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
  
    // Preload article data for all commandes
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

  // Add a new commande
  const handleAddCommande = async () => {
    setError(""); // Clear previous errors
    try {
      // Validate the required fields
      if (!form.dateCommande || !form.status || !form.dateLivraison) {
        throw new Error("Please fill in all required fields.");
      }
  
      // Create and fetch item line details
      const updatedItemLines = await Promise.all(
        form.ItemLines.map(async (item) => {
          // Ensure each item has the correct structure
          const newItemLine = {
            Articles: item.Articles, // Article ID
            UnitPrice: item.UnitPrice || 0, // Ensure there's a unit price
            quantity: item.quantity || 0, // Ensure there's a quantity
            Taxes: item.Taxes || 0, // Ensure there's a tax amount
            UOM: item.UOM || "kg", // Ensure UOM is provided
            Totalprice: item.UnitPrice * (item.quantity || 0), // Calculate total price
          };
  
          // Save the item line
          const savedItemLine = await addItemLine(newItemLine, token);
          console.log(supplier);
  
          // Check if the item line was successfully saved and return the saved version
          if (!savedItemLine || !savedItemLine._id) {
            throw new Error(`Failed to save item line for article: ${item.Articles}`);
          }
  
          // Return the updated item line with its ID (if necessary)
          return {
            ...newItemLine,
            _id: savedItemLine._id, // Include the ID of the saved item line
          };
        })
      );
  
      // Create the commande with the updated item lines
      const newCommande = {
        ...form,
        ItemLines: updatedItemLines
      };
  
      // Add the new commande to the database
      await addCommande(newCommande, token);
  
      // Reset the form after successful addition
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
            Totalprice: 0, // Include Totalprice in the reset structure
          },
        ],
        Suppliers: "",
      });
  
      // Close the form or UI element that adds new rows
      setShowAddRow(false);
  
      // Refresh the list of commandes
      await loadCommandes();
  
      // Success alert
      alert("Commande added successfully!");
    } catch (err) {
      // Handle errors and set error state
      setError(err.message || "Error adding commande");
    }
  };
  
  
  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  // Handle changes in ItemLine fields (Articles, UnitPrice, quantity, etc.)
  const handleItemLineChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItemLines = [...form.ItemLines];
    updatedItemLines[index][name] = value; // Update the correct item line field
    setForm({ ...form, ItemLines: updatedItemLines });
  };
  
  // Handle changes to the Suppliers field (single supplier for the whole form)
  const handleSupplierChange = (e) => {
    const { value } = e.target;
    setForm({ ...form, Suppliers: value });
    setSupplier(value);
  };

  const addItemLine = async (newItemLine, token) => {
    try {
      const savedItemLine = await addItemLinee(newItemLine, token); // Ensure this function actually saves the item line and returns the saved object with _id
  
      // Ensure the item line is successfully saved
      if (!savedItemLine || !savedItemLine._id) {
        throw new Error("Failed to save item line in the database.");
      }
  
      // Update form state with the saved item line (including the _id)
      setForm((prevForm) => ({
        ...prevForm,
        ItemLines: [
          ...prevForm.ItemLines,
          { ...newItemLine, _id: savedItemLine._id }, // Add the saved item line with _id
        ],
      }));
  
      // Return the saved item line with _id
      return savedItemLine;
    } catch (error) {
      // Handle any errors that occur during the process
      setError(error.message || "Error adding item line");
      return null; // Return null or handle as necessary in case of an error
    }
  };
  
  useEffect(() => {
    loadCommandes();
    loadArticles();
    loadSuppliers();
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
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleDeleteCommande(commande._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        <button
          onClick={() => setShowAddRow(!showAddRow)}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showAddRow ? "Cancel" : "Add New Commande"}
        </button>
  
        {showAddRow && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Add Commande</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="dateCommande" className="block text-sm font-medium">
                  Date Commande
                </label>
                <input
                  type="date"
                  id="dateCommande"
                  name="dateCommande"
                  value={form.dateCommande}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateLivraison" className="block text-sm font-medium">
                  Date Livraison
                </label>
                <input
                  type="date"
                  id="dateLivraison"
                  name="dateLivraison"
                  value={form.dateLivraison}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
  
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Item Lines</h4>
{form.ItemLines.map((itemLine, index) => (
  <div key={index} className="mb-4">
    {/* Article select */}
    <label className="block text-sm font-medium">Article</label>
    <select
      value={itemLine.Articles}  // Bind the Article value for this item line
      onChange={(e) => handleItemLineChange(index, e)}  // Update this item's Article
      name="Articles"
      className="w-full p-2 border rounded-md"
    >
      <option value="">Select an Article</option>
      {articles.map((article) => (
        <option key={article._id} value={article._id}>
          {article.name}
        </option>
      ))}
    </select>

    {/* Supplier select */}
    <label className="block text-sm font-medium mt-2">Supplier</label>
    <select
  value={form.Suppliers}  // Bind form.Suppliers to the selected Supplier's _id
  onChange={handleSupplierChange}  // Handle change for overall Commande Suppliers field
  name="Suppliers"
  className="w-full p-2 border rounded-md"
>
  <option value="">Select a Supplier</option>
  {suppliers.map((supplier) => (
    <option key={supplier._id} value={supplier._id}>
      {supplier.niche}
    </option>
  ))}
</select>

                    {/* Quantity input */}
                    <label className="block text-sm font-medium mt-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={itemLine.quantity}
                      onChange={(e) => handleItemLineChange(index, e)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ))}
  
                <button
                  type="button"
                  onClick={addItemLine}
                  className="mt-2 py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Item Line
                </button>
              </div>
  
              <button
                type="button"
                onClick={handleAddCommande}
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit Commande
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
  
  
};

export default CommandeManager;
