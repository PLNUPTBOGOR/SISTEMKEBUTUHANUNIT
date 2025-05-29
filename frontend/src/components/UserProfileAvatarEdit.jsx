/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5"

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0]
    setError(null)

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
      })
      const { data: responseData } = response

      dispatch(updatedAvatar(responseData.data.avatar))
      close() // close modal setelah upload sukses
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center z-50">
      <div className="bg-white max-w-sm w-full rounded p-6 flex flex-col items-center shadow-lg relative">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-neutral-800 hover:text-red-600 transition"
        >
          <IoClose size={24} />
        </button>

        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm mb-4">
          {user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegUserCircle size={72} className="text-gray-400" />
          )}
        </div>

        <form className="w-full text-center">
          <label
            htmlFor="uploadProfile"
            className={`inline-block cursor-pointer rounded border px-6 py-2 text-sm font-semibold transition
              ${loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
          >
            {loading ? "Mengunggah..." : "Unggah Gambar"}
          </label>
          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
            accept="image/*"
            disabled={loading}
          />
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>
    </section>
  )
}

export default UserProfileAvatarEdit
