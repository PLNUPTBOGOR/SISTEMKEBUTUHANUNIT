/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { Users, Package, ShoppingCart, ClipboardList } from "lucide-react";
import axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          axios.get("/api/analytics"),
          axios.get("/api/order/all-orders"),
        ]);
        setAnalytics(analyticsRes.data);
        setOrders(ordersRes.data.data);
      } catch (err) {
        setError("Gagal memuat data dashboard.");
        AxiosToastError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle ekspansi baris detail produk
  const toggleRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Badge status warna
  const getStatusBadge = (status) => {
    switch (status) {
      case "Diajukan":
        return "bg-yellow-400";
      case "Diproses":
        return "bg-blue-500";
      case "Dikirim":
        return "bg-green-500";
      case "Selesai":
        return "bg-green-700";
      case "Dibatalkan":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  // Filter orders berdasarkan nama, bulan, dan status
  const filteredOrders = orders.filter((order) => {
    const matchName = order.userId?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchMonth = selectedMonth
      ? new Date(order.createdAt).getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchStatus = filterStatus ? order.status === filterStatus : true;
    return matchName && matchMonth && matchStatus;
  });

  // Fungsi download Excel
  const downloadExcel = () => {
    const excelData = [];

    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        excelData.push({
          "Order ID": order.orderId,
          "Tanggal Pesanan": new Date(order.createdAt).toLocaleDateString(),
          "Nama Pengguna": order.userId?.name || "Unknown",
          "Email Pengguna": order.userId?.email || "No Email",
          Status: order.status,
          "Nama Produk": item?.product_details?.name || "Nama produk tidak ada",
          "Jumlah Dipesan": item.quantity,
          "Jumlah Disetujui": item.approvedQuantity || 0,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pesanan");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "daftar_pesanan.xlsx");
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!analytics) return <div className="p-6">Data tidak tersedia.</div>;

  return (
    <div className="p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Analytics Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-auto mb-6">
        <Link to="/dashboard/all">
          <StatCard
            title="Total Pengguna"
            value={analytics.totalUsers}
            icon={<Users />}
            bgColor="bg-blue-100"
            textColor="text-blue-800"
            className="p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-blue-200 transition"
          />
        </Link>

        <Link to="/dashboard/product">
          <StatCard
            title="Total Produk"
            value={analytics.totalProducts}
            icon={<Package />}
            bgColor="bg-green-100"
            textColor="text-green-800"
            className="p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-green-200 transition"
          />
        </Link>

        <Link to="/dashboard/adminorder">
          <StatCard
            title="Total Pesanan"
            value={analytics.totalOrders}
            icon={<ShoppingCart />}
            bgColor="bg-yellow-100"
            textColor="text-yellow-800"
            className="p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-yellow-200 transition"
          />
        </Link>

        <StatCard
          title="Total Permintaan"
          value={analytics.totalRequests}
          icon={<ClipboardList />}
          bgColor="bg-purple-100"
          textColor="text-purple-800"
          className="p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-purple-200 transition"
        />
      </div>

      {/* Filter dan Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama pengguna..."
          className="p-2 border rounded-md flex-grow min-w-[200px] max-w-[400px]"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-md w-40"
        >
          <option value="">Semua Bulan</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md w-40"
        >
          <option value="">Semua Status</option>
          <option value="Diajukan">Diajukan</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>

        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 min-w-[150px]"
        >
          Download Excel
        </button>
      </div>

{/* Tabel Pesanan */}
<div className="grid grid-cols-1 gap-4 overflow-auto">
  <div className="col-span-full bg-white p-6 rounded-2xl shadow-md overflow-x-auto border border-gray-300">
    <h3 className="text-xl font-semibold mb-4">Semua Pesanan</h3>

    {filteredOrders.length === 0 ? (
      <p className="text-center text-gray-500">Tidak ada order ditemukan untuk filter tersebut.</p>
    ) : (
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Order ID</th>
            <th className="border px-4 py-2 text-left">Tanggal</th>
            <th className="border px-4 py-2 text-left">Pengguna</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.orderId}>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  {order.userId?.name || "Unknown"} <br />
                  <span className="text-xs text-gray-500">{order.userId?.email || "No Email"}</span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-white text-xs font-semibold ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => toggleRow(order.orderId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    {expandedRows.includes(order.orderId) ? "Sembunyikan Detail" : "Lihat Detail"}
                  </button>
                </td>
              </tr>

              {expandedRows.includes(order.orderId) && (
                <tr>
                  <td colSpan={5} className="border px-4 py-2 bg-gray-50">
                    <table className="min-w-full border-collapse border border-gray-300 mt-2 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">Nama Produk</th>
                          <th className="border px-4 py-2 text-center">Jumlah Dipesan</th>
                          <th className="border px-4 py-2 text-center">Jumlah Disetujui</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, idx) => (
                          <tr key={idx} className="odd:bg-white even:bg-gray-50">
                            <td className="border px-4 py-2">{item?.product_details?.name || "Nama produk tidak ada"}</td>
                            <td className="border px-4 py-2 text-center">{item.quantity}</td>
                            <td className="border px-4 py-2 text-center">{item.approvedQuantity || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    )}
  </div>


      
      </div>
    </div>
  );
};

export default AdminDashboard;
