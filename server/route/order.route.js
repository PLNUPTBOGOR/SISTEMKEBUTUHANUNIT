import express from "express";
import {
  OrderBarang,
  getOrderDetailsController,
  updateStatusOrderController,
  getAllOrdersController,
  deleteOrderController,
  getRequestAnalyticsFromOrder,
  approveItemsController,
  updateInvoiceAndSuratJalan,
  getOrderByIdController,
  updateApprovedQuantities
} from "../controllers/order.controller.js";  // Sesuaikan path file controller

import auth from '../middleware/auth.js'// middleware auth untuk user login
import { admin } from '../middleware/Admin.js' // middleware untuk verifikasi admin

const orderRouter= express.Router();


// Route user membuat order
orderRouter.post("/create", auth, OrderBarang);

// Route user melihat order miliknya
orderRouter.get("/my-orders", auth, getOrderDetailsController);

// Admin update status order
orderRouter.put("/update-status", auth, admin, updateStatusOrderController);

// Admin lihat semua order
orderRouter.get("/all-orders", auth, admin, getAllOrdersController);

// Admin hapus order berdasarkan orderId
orderRouter.delete("/delete/:orderId", auth, admin, deleteOrderController);

// Admin dapatkan analytics dari order
orderRouter.get("/order/analytics", auth, admin, getRequestAnalyticsFromOrder);

// Admin approve items dalam order
orderRouter.put("/order/approve-items", auth, admin, approveItemsController);

// Admin update invoice dan surat jalan
orderRouter.put("/:orderId/invoice-suratjalan", auth, admin, updateInvoiceAndSuratJalan);

orderRouter.get("/:orderId", auth, admin, getOrderByIdController);

orderRouter.put("/:orderId/update-approved-qty", auth, admin, updateApprovedQuantities);



export default orderRouter;
