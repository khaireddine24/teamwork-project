import { ItemLine } from '../models/ItemLine.js'; // Import the ItemLine model

// Create a new item line
export const createItemLine = async (req, res) => {
    const { Articles, UnitPrice, TotalPrice, quantity, taxes, uom } = req.body;

    try {
        const itemLine = new ItemLine({ Articles, UnitPrice, TotalPrice, quantity, taxes, uom });
        await itemLine.save();
        res.status(201).json({ message: 'ItemLine created successfully', itemLine });
    } catch (error) {
        res.status(500).json({ message: 'Error creating item line', error: error.message });
    }
};

// Get all item lines
export const getAllItemLines = async (req, res) => {
    try {
        const itemLines = await ItemLine.find();
        res.status(200).json(itemLines);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item lines', error: error.message });
    }
};

// Get a single item line by ID
export const getItemLineById = async (req, res) => {
    const { id } = req.params;

    try {
        const itemLine = await ItemLine.findById(id);
        if (!itemLine) {
            return res.status(404).json({ message: 'ItemLine not found' });
        }
        res.status(200).json(itemLine);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item line', error: error.message });
    }
};
export const getItemLineByArticle = async (req, res) => {
    const { article } = req.params; // Assuming 'article' is the Article ID from the URL parameters

    try {
        // Query the ItemLine collection to find the item line with the matching Articles field
        const itemLine = await ItemLine.findOne({ Articles: article });

        if (!itemLine) {
            return res.status(404).json({ message: 'ItemLine not found' });
        }

        res.status(200).json(itemLine);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item line', error: error.message });
    }
};


// Update an item line by ID
export const updateItemLine = async (req, res) => {
    const { id } = req.params;
    const { article, unitPrice, totalPrice, quantity, taxes, uom } = req.body;

    try {
        const itemLine = await ItemLine.findByIdAndUpdate(
            id,
            { article, unitPrice, totalPrice, quantity, taxes, uom },
            { new: true, runValidators: true }
        );

        if (!itemLine) {
            return res.status(404).json({ message: 'ItemLine not found' });
        }

        res.status(200).json({ message: 'ItemLine updated successfully', itemLine });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item line', error: error.message });
    }
};

// Delete an item line by ID
export const deleteItemLine = async (req, res) => {
    const { id } = req.params;

    try {
        const itemLine = await ItemLine.findByIdAndDelete(id);

        if (!itemLine) {
            return res.status(404).json({ message: 'ItemLine not found' });
        }

        res.status(200).json({ message: 'ItemLine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item line', error: error.message });
    }
};
