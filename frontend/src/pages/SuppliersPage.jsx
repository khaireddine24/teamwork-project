import React, { useState, useEffect } from "react";
import axios from "axios"
import { useAuthStore } from "../store/authStore";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", email: "", phone: "", niche: "" });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { user } = useAuthStore(); 

  useEffect(() => {
    fetchSuppliers();
  }, [user]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/supplier",{
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError(err.message || "An error occurred while fetching suppliers.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddSupplier = async () => {
    try {
      await axios.post(
        "http://localhost:5000/supplier/add",
        form, // Ensure form is correctly structured
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Include the admin's token
            "Content-Type": "application/json", // Explicitly define content type
          },
        }
      );
      fetchSuppliers(); // Refresh the list of suppliers
      setForm({ name: "", address: "", email: "", phone: "", niche: "" }); // Reset the form
    } catch (err) {
      console.error("Error adding supplier:", err);
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setForm(supplier);
  };

  const handleUpdateSupplier = async () => {
    try {
      await axios.put(
        `http://localhost:5000/supplier/${editingSupplier._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchSuppliers();
      setEditingSupplier(null);
      setForm({ name: "", address: "", email: "", phone: "", niche: "" });
    } catch (err) {
      console.error("Error updating supplier:", err);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Suppliers</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {editingSupplier ? "Edit Supplier" : "Add Supplier"}
        </h2>
        <form
          className="flex flex-col space-y-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Name"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            placeholder="Address"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            placeholder="Phone"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="niche"
            value={form.niche}
            placeholder="Niche"
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <button
            onClick={editingSupplier ? handleUpdateSupplier : handleAddSupplier}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingSupplier ? "Update" : "Add"} Supplier
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-2">All Suppliers</h2>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier._id} className="border p-2 rounded mb-2 flex justify-between">
            <span>
              {supplier.name} - {supplier.email}
            </span>
            <div>
              <button
                onClick={() => handleEditSupplier(supplier)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSupplier(supplier._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuppliersPage;
