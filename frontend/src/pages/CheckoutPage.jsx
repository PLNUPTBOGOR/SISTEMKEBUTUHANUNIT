/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(null);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const totalQty = cartItemsList.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();

  const handleToOrder = async () => {
    const selectedAddr = addressList[selectAddress];

    // Validasi alamat
    if (!selectedAddr || selectedAddr.status === false) {
      toast.error("Silakan pilih alamat yang valid.");
      return;
    }

    // Validasi isi alamat lengkap
    const requiredFields = ["address_line", "city", "state", "pincode", "mobile"];
    for (let field of requiredFields) {
      if (!selectedAddr[field]) {
        toast.error("Alamat yang dipilih tidak lengkap. Mohon lengkapi alamat terlebih dahulu.");
        return;
      }
    }

    // Validasi cart
    if (!cartItemsList.length) {
      toast.error("Keranjanag Masih kosong.");
      return;
    }

    // Validasi setiap item
    for (let item of cartItemsList) {
      if (!item.productId || item.quantity <= 0) {
        toast.error("Terdapat item tidak valid di keranjang.");
        return;
      }
    }

    try {
      const response = await Axios({
        ...SummaryApi.Order,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddr._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate("/success", {
          state: { text: "Pesanan" },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const isOrderValid =
    addressList.length > 0 &&
    selectAddress !== null &&
    addressList[selectAddress]?.status === true &&
    cartItemsList.length > 0;

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold">Pilih Alamat Anda</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => (
              <label
                key={index}
                htmlFor={"address" + index}
                className={address.status ? "" : "hidden"}
              >
                <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                  <div>
                    <input
                      id={"address" + index}
                      type="radio"
                      value={index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name="address"
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Detail Tagihan</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Total Kuantitas</p>
              <p className="flex items-center gap-2">{totalQty} Barang</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Biaya Pengiriman</p>
              <p className="flex items-center gap-2">Gratis</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <button
              className={`py-2 px-4 border-2 font-semibold ${
                isOrderValid
                  ? "border-[#125d72] text-[#125d72] hover:bg-[#125d72] hover:text-white"

                  : "border-gray-400 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleToOrder}
              disabled={!isOrderValid}
            >
              Pesan
            </button>
          </div>
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;

