/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react";
import axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk mengambil semua order
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order/all-orders");
      // Pastikan backend mengembalikan data dalam bentuk { data: [...] }
      setOrders(res.data.data || []);
    } catch (error) {
      AxiosToastError(error);
      console.error("Gagal ambil data orders", error);
    } finally {
      setLoading(false);
    }
  };

  // Update status order
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put("/api/order/update-status", {
        orderId,
        newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      AxiosToastError(error);
      console.error("Gagal update status", error);
    }
  };

  // Hapus order
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/order/delete/${orderId}`);
      fetchOrders(); // refresh data setelah hapus
    } catch (error) {
      AxiosToastError(error);
      console.error("Gagal hapus order", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  // Filter berdasarkan status
  const filteredOrders = orders.filter(
    (order) => !filterStatus || order.status === filterStatus
  );

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Semua Pesanan</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="Diajukan">Diajukan</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Tidak ada order ditemukan untuk status tersebut.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="border p-4 rounded shadow-md bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Order ID: {order.orderId}</p>
                  <p>
                    User: {order.userId?.name || "Unknown"} (
                    {order.userId?.email || "No Email"})
                  </p>
                  <p>Status: {order.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/adminorder/${order.orderId}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Lihat Detail
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.orderId, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Diajukan">Diajukan</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                  <button
                    onClick={() => handleDeleteOrder(order.orderId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item?.product_details?.image?.[0] || "/no-image.png"}
                      alt={item?.product_details?.name || "Produk"}
                      className="w-12 h-12 object-cover border rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {item?.product_details?.name || "Nama produk tidak ada"}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrderPage;
