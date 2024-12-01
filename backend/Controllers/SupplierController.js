import { Supplier } from '../models/Supplier.js';
import nodemailer from 'nodemailer';
import { templates } from '../template/index.js';
// Create a new supplier
const createSupplier = async (req, res) => {
    const { name, address, email, phone, niche } = req.body; // Added niche here

    try {
        const supplier = new Supplier({ name, address, email, phone, niche }); // Added niche here
        await supplier.save();
        res.status(201).json({ message: "Supplier created successfully", supplier });
    } catch (error) {
        res.status(500).json({ message: "Error creating supplier", error: error.message });
    }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find(); // Changed fournisseur to supplier
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suppliers", error: error.message });
    }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id); // Changed fournisseur to supplier
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error fetching supplier", error: error.message });
    }
};

// Update a supplier by ID
const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, address, email, phone, niche } = req.body; // Added niche here

    try {
        const supplier = await Supplier.findByIdAndUpdate(
            id,
            { name, address, email, phone, niche }, // Added niche here
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier updated successfully", supplier });
    } catch (error) {
        res.status(500).json({ message: "Error updating supplier", error: error.message });
    }
};

// Delete a supplier by ID
const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByIdAndDelete(id); // Changed fournisseur to supplier

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting supplier", error: error.message });
    }
};

// Export all functions in one statement
export { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };
