/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()


        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/home")
            }

        } catch (error) {
            AxiosToastError(error)
        }

    }
    return (

        
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
            <h3 className='text-2xl font-bold text-[#125d72] text-center mb-6 tracking-wide'>
                    MASUK
                </h3>

            

                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1 '>
                        <label className='font-bold ' htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Masukan email anda'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label className='font-bold ' htmlFor='password'>Kata sandi :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className="w-full bg-transparent outline-none placeholder-gray-500 text-black"
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Masukan kata sandi'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Lupa kata sandi?</Link>
                    </div>

                    <button disabled={!valideValue} className={` ${valideValue ? "bg-[#14a2ba] hover:bg-[#128499]" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Masuk</button>

                </form>

                <p>
                    Belum punya akun? <Link to={"/register"} className="font-semibold text-[#14a2ba] hover:text-[#128499]">Daftar</Link>
                </p>
            </div>
        </section>
    )
}

export default Login
