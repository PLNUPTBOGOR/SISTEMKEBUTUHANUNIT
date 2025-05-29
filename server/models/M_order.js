import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        approvedQuantity: {
          type: Number,
          default: 0,
        },
        product_details: {
          name: String,
          image: [String],
          category: String,
        },
        notes: {
          type: String,
          default: "",
        },
      },
    ],

    status: {
      type: String,
      enum: ["Diajukan", "Diproses", "Dikirim", "Selesai", "Dibatalkan"],
      default: "Diajukan",
    },

    suratJalan: {
      number: { type: String, default: "" }, // No Surat
      purpose: { type: String, default: "" }, // Untuk Keperluan
      destination: { type: String, default: "" }, // Tujuan
      accordingToRequest: { type: String, default: "" }, // Menurut Permintaan
      vehicle: { type: String, default: "" }, // Kendaraan
      driver: { type: String, default: "" }, // Pengemudi
      receiver: { type: String, default: "" }, // Yang menerima
      approver: { type: String, default: "" }, // Yang mengijinkan
      url: { type: String, default: "" }, // File PDF (jika ada)
      date: { type: Date }, // Tanggal Surat Jalan
    },

    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
