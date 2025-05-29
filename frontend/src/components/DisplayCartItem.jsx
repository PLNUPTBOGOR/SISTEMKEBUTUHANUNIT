/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */


import React from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import imageEmpty from "../assets/empty_cart.png";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) close();
    } else {
      toast("Silakan login terlebih dahulu.");
    }
  };

    const closeCart = () => setShowCart(false);

  return (
    <section className="bg-black bg-opacity-50 fixed inset-0 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen ml-auto shadow-lg flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
          <h2 className="font-semibold text-lg">Keranjang</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-blue-50 px-3 py-4">
          {cartItem.length > 0 ? (
            <>
              {/* Cart Items */}
              <section className="space-y-4">
                {cartItem.map((item, index) => (
                  <div
                    key={item?._id + "_cartItem"}
                    className="flex items-center gap-4 bg-white rounded-md shadow-sm p-3"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item?.productId?.image[0]}
                        alt="product"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium line-clamp-2">
                        {item?.productId?.name}
                      </p>
                      <p className="text-gray-500">{item?.productId?.unit}</p>
                    </div>
                    <AddToCartButton data={item?.productId} />
                  </div>
                ))}
              </section>

              {/* Billing Summary */}
              <section className="mt-5 bg-white p-4 rounded-md shadow">
                <h3 className="font-semibold mb-2">Rincian</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Jumlah</span>
                  <span>{totalQty} item</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biaya Pengiriman</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
              </section>
            </>
          ) : (
            // Empty Cart State
            <section className="flex flex-col items-center justify-center h-full gap-6 text-center px-4 pt-10">
              <img
                src={imageEmpty}
                alt="Empty Cart"
                className="w-54 h-64 object-contain mx-auto"
              />
              <p className="text-gray-600 text-lg font-medium">
                Keranjangmu masih kosong.
              </p>
              <Link
                to="/"
                onClick={close}
                className="text-[#125d72] border border-[#125d72] hover:bg-[#125d72] hover:text-white px-6 py-2 rounded-md font-semibold transition"
              >
                Belanja Sekarang
              </Link>
            </section>
          )}
        </main>

        {/* Footer */}
        {cartItem.length > 0 && (
          <footer className="p-4 border-t">
            <button
              onClick={redirectToCheckoutPage}
              className="w-full bg-[#125d72] hover:bg-[#0e4e60] text-white font-semibold py-3 rounded-md flex justify-center items-center gap-2 transition"
            >
              Proses <FaCaretRight />
            </button>
          </footer>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
