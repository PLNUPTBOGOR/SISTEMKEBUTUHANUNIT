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
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText } from "lucide-react"; // icon surat jalan

const AdminOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvalData, setApprovalData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState(null);

  const extractStreetName = (address) => {
    if (!address) return "-";
    const cleanedAddress = address.replace(/^\d+\|/, "");
    return cleanedAddress.split(",")[0] || cleanedAddress;
  };
  

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/order/${orderId}`);
      const orderData = res.data.data;
      setOrder(orderData);

      const initialApproval = orderData.items.map((item) => ({
        productId: item.productId || item.product_details?._id,
        productName: item.product_details?.name || item.productName,
        qtyOrdered: item.quantity,
        approvedQuantity: item.approvedQuantity || 0,
      }));
      setApprovalData(initialApproval);
      setDeliveryNote(orderData.deliveryNote || null);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrderDetail();
  }, [orderId]);

  const handleApprovedQuantityChange = (productId, value) => {
    let parsed = parseInt(value);
    if (isNaN(parsed)) parsed = 0;
    const maxQty =
      approvalData.find((item) => item.productId === productId)?.qtyOrdered || 0;
    const safeQty = Math.min(Math.max(0, parsed), maxQty);

    setApprovalData((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, approvedQuantity: safeQty }
          : item
      )
    );
  };

  const handleSubmitApproval = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        updates: approvalData.map(({ productId, approvedQuantity }) => ({
          productId,
          approvedQuantity,
        })),
      };

      const res = await axios.put(`/api/order/${orderId}/update-approved-qty`, payload);
      toast.success("Persetujuan berhasil disimpan");

      const updatedOrder = res.data.order || res.data.data || order;
      setOrder(updatedOrder);

      const updatedApproval = updatedOrder.items.map((item) => ({
        productId: item.productId || item.product_details?._id,
        productName: item.product_details?.name || "-",
        qtyOrdered: item.quantity,
        approvedQuantity: item.approvedQuantity || 0,
      }));
      setApprovalData(updatedApproval);
      setDeliveryNote(updatedOrder.deliveryNote || null);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsProcessing(false);
    }
  };


  // **Tombol Surat Jalan diklik -> navigasi ke halaman surat jalan**
  const handleSuratJalanClick = () => {
    navigate(`/order/${orderId}/invoice-suratjalan`);
  };

  if (loading) return <div className="p-6">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-6">Pesanan tidak ditemukan.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        ← Kembali ke Daftar Pesanan
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Header & Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Pesanan #{order.orderId}
            </h1>
            <div className="flex items-center mt-2 space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Diajukan"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "Diproses"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Selesai"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
              <span className="text-gray-500">
                Dibuat: {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
     
            {/* Tombol Surat Jalan */}
            <button
              onClick={handleSuratJalanClick}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              title="Buat Surat Jalan"
            >
              <FileText className="w-5 h-5" />
              Surat Jalan
            </button>
          </div>
        </div>

        {/* Info Pelanggan dan Alamat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Informasi Pelanggan</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Nama:</strong> {order.userId?.name || "-"}</p>
              <p><strong>Email:</strong> {order.userId?.email || "-"}</p>
              <p><strong>Telepon:</strong> {order.userId?.mobile || "-"}</p>
            </div>
          </div>
          <div>
          </div>
        </div>

        {/* Tabel Persetujuan */}
        <h2 className="text-lg font-semibold mb-3">Persetujuan Pesanan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Qty Diminta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Qty Disetujui</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => {
                const pid = item.productId || item.product_details?._id;
                const approvalItem = approvalData.find((ad) => ad.productId === pid) || {};
                return (
                  <tr key={pid}>
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img
                        src={item.product_details?.image?.[0] || "/no-image.png"}
                        alt={item.product_details?.name || "Produk"}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {item.product_details?.name || item.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min={0}
                        max={item.quantity}
                        value={approvalItem.approvedQuantity || 0}
                        onChange={(e) =>
                          handleApprovedQuantityChange(pid, e.target.value)
                        }
                        className="w-20 border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleSubmitApproval}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {isProcessing ? "Menyimpan..." : "Simpan Persetujuan"}
          </button>
        </div>

        {deliveryNote && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <h3 className="font-semibold mb-1">Catatan Pengiriman</h3>
            <p>{deliveryNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
