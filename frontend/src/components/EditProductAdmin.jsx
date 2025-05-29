/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */


import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const allCategory = useSelector((state) => state.product.allCategory || []);
  const allSubCategory = useSelector((state) => state.product.allSubCategory || []);

  const [data, setData] = useState({
    _id: propsData._id || "",
    name: propsData.name || "",
    image: propsData.image || [],
    category: propsData.category || [],
    subCategory: propsData.subCategory || [],
    unit: propsData.unit || "",
    stock: propsData.stock || "",
    description: propsData.description || "",
    more_details: propsData.more_details || {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageLoading(true);
      const response = await uploadImage(file);
      const imageUrl = response?.data?.data?.url;

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl],
      }));
    } catch (error) {
      console.error("Upload gagal", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.image];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, image: newImages }));
  };

  const handleRemoveCategory = (index) => {
    const newCategory = [...data.category];
    newCategory.splice(index, 1);
    setData((prev) => ({ ...prev, category: newCategory }));
  };

  const handleRemoveSubCategory = (index) => {
    const newSubCategory = [...data.subCategory];
    newSubCategory.splice(index, 1);
    setData((prev) => ({ ...prev, subCategory: newSubCategory }));
  };

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: { ...prev.more_details, [fieldName]: "" },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data,
      });

      if (response.data?.success) {
        successAlert(response.data.message);
        fetchProductData();
        close?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-70 p-4 z-50">
      <div className="bg-white w-full max-w-2xl mx-auto p-4 rounded overflow-y-auto h-full max-h-[95vh]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Produk</h1>
          <button onClick={close}><IoClose size={24} /></button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium">Nama Produk</label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Masukkan nama produk"
              required
              className="bg-blue-50 border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="font-medium">Deskripsi</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi"
              rows={3}
              className="bg-blue-50 border p-2 w-full rounded resize-none"
              required
            />
          </div>

          <div>
            <label className="font-medium">Gambar</label>
            <label htmlFor="productImage" className="cursor-pointer border rounded bg-blue-50 h-24 flex items-center justify-center">
              {imageLoading ? <Loading /> : (
                <div className="flex flex-col items-center">
                  <FaCloudUploadAlt size={30} />
                  <span>Unggah Gambar</span>
                </div>
              )}
              <input type="file" id="productImage" accept="image/*" hidden onChange={handleUploadImage} />
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {data.image.map((img, idx) => (
                <div key={img + idx} className="relative h-20 w-20 bg-blue-100 border">
                  <img
                    src={img}
                    alt={`gambar-${idx}`}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setViewImageURL(img)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx)}
                    className="absolute bottom-1 right-1 p-1 bg-red-600 text-white rounded"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">Kategori</label>
            <select
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value;
                const selected = allCategory.find((c) => c._id === value);
                if (selected) {
                  setData((prev) => ({
                    ...prev,
                    category: [...prev.category, selected],
                  }));
                }
                setSelectCategory("");
              }}
              className="bg-blue-50 border w-full p-2 rounded"
            >
              <option value="">Pilih Kategori</option>
              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.category.map((c, i) => (
                <div key={c._id + i} className="bg-blue-100 text-sm px-2 py-1 rounded flex items-center gap-1">
                  {c.name}
                  <IoClose className="cursor-pointer" onClick={() => handleRemoveCategory(i)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">Sub Kategori</label>
            <select
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value;
                const selected = allSubCategory.find((sc) => sc._id === value);
                if (selected) {
                  setData((prev) => ({
                    ...prev,
                    subCategory: [...prev.subCategory, selected],
                  }));
                }
                setSelectSubCategory("");
              }}
              className="bg-blue-50 border w-full p-2 rounded"
            >
              <option value="">Pilih Sub Kategori</option>
              {allSubCategory.map((sc) => (
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.subCategory.map((sc, i) => (
                <div key={sc._id + i} className="bg-blue-100 text-sm px-2 py-1 rounded flex items-center gap-1">
                  {sc.name}
                  <IoClose className="cursor-pointer" onClick={() => handleRemoveSubCategory(i)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">Unit</label>
            <input
              name="unit"
              value={data.unit}
              onChange={handleChange}
              placeholder="Satuan produk"
              className="bg-blue-50 border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="font-medium">Stok</label>
            <input
              name="stock"
              type="number"
              value={data.stock}
              onChange={handleChange}
              placeholder="Jumlah stok"
              className="bg-blue-50 border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-medium">Detail Tambahan</label>
              <button
                type="button"
                className="text-sm text-blue-600"
                onClick={() => setOpenAddField(true)}
              >
                + Tambah Field
              </button>
            </div>
            {Object.keys(data.more_details).length > 0 &&
              Object.entries(data.more_details).map(([key, value]) => (
                <div key={key} className="flex gap-2 my-1">
                  <input
                    className="bg-blue-50 border p-2 rounded w-1/2"
                    value={key}
                    disabled
                  />
                  <input
                    className="bg-blue-50 border p-2 rounded w-full"
                    value={value}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        more_details: {
                          ...prev.more_details,
                          [key]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Simpan Perubahan
          </button>
        </form>
      </div>

      {viewImageURL && <ViewImage url={viewImageURL} onClose={() => setViewImageURL("")} />}
      {openAddField && (
        <AddFieldComponent
          fieldName={fieldName}
          setFieldName={setFieldName}
          onAdd={handleAddField}
          onCancel={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default EditProductAdmin;
