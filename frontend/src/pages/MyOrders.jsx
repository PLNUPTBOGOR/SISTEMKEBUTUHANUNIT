/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */
import React from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  console.log("Orders:", orders);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Pesanan Saya</h1>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        orders.map((order, index) => {
          // Hitung total quantity dan total approved quantity
          const totalQuantity = order.items.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const totalApproved = order.items.reduce(
            (acc, item) => acc + (item.approvedQuantity || 0),
            0
          );

          return (
            <div
              key={order._id + index + "order"}
              className="bg-white shadow-md rounded-md p-4 mb-6"
            >
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Pesanan No:</span> {order.orderId}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Tanggal:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Summary Barang ACC */}
              <p className="mb-4 font-semibold text-gray-700">
                Barang ACC: {totalApproved} dari {totalQuantity}
              </p>

              <div className="mb-2">
                <h2 className="font-semibold text-gray-700 mb-2">
                  Produk Dipesan:
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 border p-3 rounded-md shadow-sm"
                    >
                      <img
                        src={item.product_details?.image?.[0] || "/no-image.png"}
                        alt={item.product_details?.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {item.product_details?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Jumlah ACC:{" "}
                          <span className="font-semibold">
                            {item.approvedQuantity || 0}
                          </span>{" "}
                          dari{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
