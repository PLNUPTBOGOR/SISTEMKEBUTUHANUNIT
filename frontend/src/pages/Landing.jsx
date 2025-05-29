
/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import bgMobile from '../assets/background_mobile.png'
import bgDesktop from '../assets/background2.png'

const Landing = () => {
  const user = useSelector((state) => state.user?.user)
  const [bgImage, setBgImage] = useState(bgDesktop)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBgImage(bgMobile)
      } else {
        setBgImage(bgDesktop)
      }
    }

    // Initial check
    handleResize()

    // Listen to resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-30 transition-all duration-300"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-950 drop-shadow-lg">
          Sistem Kebutuhan Internal PLN
        </h1>
        <p className="text-lg md:text-xl mb-6 text-blue-950 drop-shadow-lg">
          Kelola pengajuan dan pemantauan antar unit dengan efisien.
        </p>
        <Link to="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition">
            Masuk Sekarang
          </button>
        </Link>
      </div>
    </section>
  )
}

export default Landing
