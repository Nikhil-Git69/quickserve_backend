import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
