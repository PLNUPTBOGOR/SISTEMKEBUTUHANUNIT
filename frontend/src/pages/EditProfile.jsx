/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useNavigate } from 'react-router-dom'
import { FaRegUserCircle, FaUser, FaEnvelope, FaPhone } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'

const EditProfile = () => {
  const user = useSelector(state => state.user)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
  const [openAvatarPreview, setAvatarPreview] = useState(false)

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      if (response.data.success) {
        toast.success(response.data.message)
        const updatedUser = await fetchUserDetails()
        dispatch(setUserDetails(updatedUser.data))
        navigate('/dashboard/profile')
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-8 md:flex md:space-x-10">
        {/* Avatar Section */}
        <div className="md:w-1/3 flex flex-col items-center border-r border-gray-200 pr-8">
          <div
            onClick={() => user.avatar && setAvatarPreview(true)}
            className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:brightness-90 transition"
            title={user.avatar ? "Klik untuk lihat gambar besar" : ""}
          >
            {
              user.avatar ? (
                <img
                  alt={user.name}
                  src={user.avatar}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUserCircle size={96} className="text-gray-400" />
              )
            }
          </div>
          <button
            onClick={() => setProfileAvatarEdit(true)}
            className="mt-6 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Edit Gambar
          </button>
        </div>

        {/* Form Section */}
        <div className="md:w-2/3 mt-8 md:mt-0">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900 text-center md:text-left">
            Edit Profile
          </h2>

          {openProfileAvatarEdit && (
            <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
          )}

          {openAvatarPreview && (
            <section
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={() => setAvatarPreview(false)}
            >
              <div
                className="relative max-w-lg max-h-[80vh] p-4 bg-white rounded"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setAvatarPreview(false)}
                  aria-label="Close"
                  className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
                >
                  <IoClose size={28} />
                </button>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="max-w-full max-h-[70vh] object-contain rounded"
                />
              </div>
            </section>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {[  
              { label: "Nama", name: "name", type: "text", icon: <FaUser />, placeholder: "Masukkan nama" },
              { label: "Email", name: "email", type: "email", icon: <FaEnvelope />, placeholder: "Masukkan email" },
              { label: "No HP", name: "mobile", type: "text", icon: <FaPhone />, placeholder: "Masukkan nomor HP" },
            ].map(({ label, name, type, icon, placeholder }) => (
              <div key={name} className="relative">
                <label className="block mb-2 font-medium text-gray-700">{label}</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <span className="text-blue-600 mr-4 text-xl">
                    {icon}
                  </span>
                  <input
                    type={type}
                    name={name}
                    value={userData[name]}
                    onChange={handleOnChange}
                    placeholder={placeholder}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white shadow-lg transition
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
