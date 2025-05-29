/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 12, search },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setProductData(responseData.data);
        setTotalPageCount(responseData.totalNoPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductData();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPageCount) setPage((prev) => prev + 1);
  };

  return (
    <section className="min-h-screen bg-blue-50 p-4">
      {/* Header & Search */}
      {/* <div className="bg-white shadow-md rounded-md p-4 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-700 capitalize">Produk</h1>
      </div> */}
            <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center"> Produk </h1>
        <div className="flex items-center gap-3 w-full max-w-md bg-blue-50 px-4 py-2 rounded border border-blue-300 focus-within:border-blue-500 transition">
          <IoSearchOutline size={24} className="text-blue-600" />
          <input
            type="text"
            placeholder="Cari produk di sini ..."
            className="w-full bg-transparent outline-none text-gray-700 text-base"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && <Loading />}

      {/* Grid Produk */}
      {/* <div className="bg-white rounded-md p-4 shadow-md min-h-[55vh]"> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {productData.map((p, index) => (
            <ProductCardAdmin
              key={p.id || index}
              data={p}
              fetchProductData={fetchProductData}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`px-5 py-2 rounded border font-medium transition ${
              page === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-blue-500 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Sebelumnya
          </button>

          <div className="text-gray-700 font-semibold px-4 py-2 border rounded bg-gray-100 w-20 text-center">
            {page} / {totalPageCount}
          </div>

          <button
            onClick={handleNext}
            disabled={page === totalPageCount}
            className={`px-5 py-2 rounded border font-medium transition ${
              page === totalPageCount
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-blue-500 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Selanjutnya
          </button>
        </div>
      {/* </div> */}
    </section>
  );
};

export default ProductAdmin;
