import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerDetails: {
      name: {
        type: String,
        required: true,
      },  
      phone: {
        type: Number,
        required: true,
    
      },
      guests:{
        type: Number, 
        required: true,
      }
    },
    orderStatus: {
        type: String,
        required: true,
    },
    orderDate:{
        type: Date,
        default: Date.now()

    },
    bills:{
        total:{
            type: Number,
            required:true,      
        },
        tax: {
            type: Number,
            required: true,
        },
        totalWithTax: {
            type: Number,
            required: true,
        }
    },
    items: [],

    table: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Table"
    },  

    paymentMethod: {
         type: String,
         enum: ["Cash", "eSewa", "Khalti", "Card"]
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
        default: "Pending"
    },

    invoiceNumber: {
        type: String
    },

    checkedOutAt: {
    type: Date
    }   


}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

export default Order;


