/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import isAdmin from '../utils/isAdmin'

// Icons
import { HiOutlineExternalLink, HiOutlineViewGrid, HiOutlineUpload } from "react-icons/hi"
import { FiPackage, FiShoppingBag, FiLogOut } from "react-icons/fi"
import { RiListSettingsLine, RiHome2Line } from "react-icons/ri"
import { BiCategoryAlt, BiSubdirectoryRight } from "react-icons/bi"
import { MdOutlineLocationOn } from "react-icons/md"

const UserMenu = ({ close }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response.data.success) {
        if (close) close()
        dispatch(logout())
        localStorage.clear()
        toast.success(response.data.message)
        navigate("/")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (close) close()
  }

  return (
    <nav>
      <div className='mb-6 flex items-center gap-3'>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-lg text-gray-600 uppercase font-semibold">
          {user.name ? user.name.charAt(0) : "U"}
        </div>
        <div className='flex-1 leading-tight'>
          <p className='text-gray-900 font-semibold truncate max-w-full text-sm'>
            {user.name || user.mobile}
          </p>
          {user.role === "ADMIN" && (
            <span className='text-xs text-red-600 font-semibold leading-tight'>Administrator</span>
          )}
        </div>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='text-blue-600 hover:text-blue-800' title="Lihat profil">
          <HiOutlineExternalLink size={18} />
        </Link>
      </div>

      <Divider />

      <ul className='space-y-1 text-gray-700 text-sm'>
        {isAdmin(user.role) && (
          <>
            <li>
              <Link onClick={handleClose} to={"/dashboard/analytics"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <HiOutlineViewGrid size={18} /> Dashboard
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={"/dashboard/adminorder"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <FiShoppingBag size={18} /> Semua Pesanan
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={"/dashboard/category"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <BiCategoryAlt size={18} /> Kategori
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={"/dashboard/subcategory"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <BiSubdirectoryRight size={18} /> Sub Kategori
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={"/dashboard/upload-product"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <HiOutlineUpload size={18} /> Unggah Produk
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={"/dashboard/product"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
                <FiPackage size={18} /> Produk
              </Link>
            </li>
          </>
        )}

        <li>
          <Link onClick={handleClose} to={"/dashboard/myorders"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
            <RiListSettingsLine size={18} /> Pesanan Saya
          </Link>
        </li>
        <li>
          <Link onClick={handleClose} to={"/dashboard/address"} className='flex items-center gap-2 px-3 py-2 rounded-md hover:bg-yellow-200 transition'>
            <MdOutlineLocationOn size={18} /> Alamat Tersimpan
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className='flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-yellow-200 transition text-red-600 font-semibold'>
            <FiLogOut size={18} /> Keluar
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default UserMenu
