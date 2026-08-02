import createHttpError from "http-errors";
import mongoose from "mongoose";
import Category from "../model/Category.js";

const addCategory = async (req, res, next) => {
    try {
        const { name, icon, bgColor } = req.body;

        if (!name) {
            const error = createHttpError(400, "Please provide a category name!");
            return next(error);
        }

        const isCategoryPresent = await Category.findOne({ name });
        if (isCategoryPresent) {
            const error = createHttpError(400, "Category already exists!");
            return next(error);
        }

        const newCategory = new Category({ name, icon, bgColor });
        await newCategory.save();

        res.status(201).json({ success: true, message: "Category Added", data: newCategory });
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, message: "Categories fetched successfully", data: categories });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { name, icon, bgColor } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Category Id!");
            return next(error);
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, icon, bgColor },
            { new: true }
        );

        if (!category) {
            const error = createHttpError(404, "Category not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Category successfully updated!", data: category });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid Category Id!");
            return next(error);
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            const error = createHttpError(404, "Category not found!");
            return next(error);
        }

        res.status(200).json({ success: true, message: "Category successfully deleted!" });
    } catch (error) {
        next(error);
    }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
