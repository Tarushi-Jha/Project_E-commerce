import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },

      orderItems: [
        {
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          price: {
            type: String,
            required: true,
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
        },
      ],
      paymentMethod: {
        type: String,
        required: [true, "Please select payment method"],
        enum: {
          values: ["COD", "UPI"],
          message: "Please select: COD or UPI",
        },
      },
      paymentInfo: {
        id: String,
        status: String,
      },
      itemsPrice: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      deliveredAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
