/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between w-full min-w-[160px] h-full">
      {/* Konten utama */}
      <div className="flex flex-col flex-grow">
        {/* Gambar produk */}
        <div className="w-full h-36 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          <img
            src={data?.image[0] || 'https://via.placeholder.com/150'}
            alt={data?.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Nama dan unit */}
        <p className="text-sm font-semibold line-clamp-2 mt-2">{data?.name}</p>
        <p className="text-xs text-gray-500 mt-1">{data?.unit}</p>
      </div>

      {/* Tombol Edit / Delete */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          onClick={() => setEditOpen(true)}
          className="border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>

      {/* Modal edit */}
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Modal konfirmasi delete */}
      {openDelete && (
        <section className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 w-full max-w-md rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Hapus Produk</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="text-sm">Apakah Anda yakin ingin menghapus produk ini secara permanen?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleDeleteCancel}
                className="border px-4 py-1 text-sm rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="border px-4 py-1 text-sm rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200"
              >
                Hapus
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
