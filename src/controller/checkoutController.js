import Order from "../model/Order.js";
import Table from "../model/Table.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const checkoutOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(
                createHttpError(404, "Invalid Order Id")
            );
        }

        const order = await Order.findById(id);

        if (!order) {
            return next(
                createHttpError(404, "Order not found")
            );
        }

        if (order.paymentStatus === "Paid") {
            return next(
                createHttpError(
                    400,
                    "Order already checked out"
                )
            );
        }

        order.paymentMethod = paymentMethod;
        order.paymentStatus = "Paid";
        order.orderStatus = "Completed";
        order.invoiceNumber = `INV-${Date.now()}`;
        order.checkedOutAt = new Date();

        await order.save();

        // Release table after successful checkout
        if (order.table) {
            await Table.findByIdAndUpdate(
                order.table,
                {
                    status: "Available",
                    currentOrder: null,
                },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Checkout successful",
            data: order,
        });

    } catch (error) {
        next(error);
    }
};

const getInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(
                createHttpError(404, "Invalid Order Id")
            );
        }

        const order = await Order.findById(id);

        if (!order) {
            return next(
                createHttpError(404, "Order not found")
            );
        }

        if (order.paymentStatus !== "Paid") {
            return next(
                createHttpError(
                    400,
                    "Invoice is not available for unpaid orders"
                )
            );
        }

        res.status(200).json({
            success: true,
            data: {
                invoiceNumber: order.invoiceNumber,
                customerDetails: order.customerDetails,
                items: order.items,
                bills: order.bills,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                orderDate: order.orderDate,
                checkedOutAt: order.checkedOutAt,
            },
        });

    } catch (error) {
        next(error);
    }
};

export { checkoutOrder, getInvoice };