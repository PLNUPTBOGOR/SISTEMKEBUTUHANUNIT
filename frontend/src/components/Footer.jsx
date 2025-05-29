/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 text-center flex flex-col lg:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © 2025 PT PLN (Persero) UPT Bogor. All Rights Reserved.
        </p>

        <div className="flex items-center gap-4 text-xl text-gray-700 dark:text-gray-300">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/plnuptbogor?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
