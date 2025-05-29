/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto p-6 grid lg:grid-cols-[280px,1fr] gap-8'>
        {/* Sidebar Menu */}
        <aside className='bg-white rounded-lg shadow-md sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block'>
          <div className='px-4 py-2'>
            <UserMenu />
          </div>
        </aside>

        {/* Main Content */}
        <main className='bg-white rounded-lg shadow-md min-h-[75vh] p-8'>
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default Dashboard
