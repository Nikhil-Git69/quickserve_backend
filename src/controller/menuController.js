import createHttpError from "http-errors";
import mongoose from "mongoose";
import MenuItem from "../model/MenuItem.js";

const addMenuItem = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            const error = createHttpError(400, "Please provide name, price, and category!");
            return next(error);
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            const error = createHttpError(400, "Invalid Category Id!");
            return next(error);
        }

        const isItemPresent = await MenuItem.findOne({ name, category });
        if (isItemPresent) {
            const error = createHttpError(400, "Menu item already exists in this category!");
            return next(error);
        }

        const newMenuItem = new MenuItem({ name, price, category });
        await newMenuItem.save();

        res.status(201).json({ success: true, message: "Menu Item Added", data: newMenuItem });
    } catch (error) {
        next(error);
    }
};

const getMenuItems = async (req, res, next) => {
    try {
        const menuItems = await MenuItem.find().populate("category", "name icon bgColor");
        res.status(200).json({ success: true, message: "Menu Items fetched successfully", data: menuItems });
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    try {
        const { name, price, category } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Menu Item Id!");
            return next(error);
        }

        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            const error = createHttpError(400, "Invalid Category Id!");
            return next(error);
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { name, price, category },
            { new: true }
        ).populate("category", "name icon bgColor");

        if (!menuItem) {
            const error = createHttpError(404, "Menu Item not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Menu Item successfully updated!", data: menuItem });
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Menu Item Id!");
            return next(error);
        }

        const menuItem = await MenuItem.findByIdAndDelete(id);

        if (!menuItem) {
            const error = createHttpError(404, "Menu Item not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Menu Item successfully deleted!" });
    } catch (error) {
        next(error);
    }
};

export { addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem };
