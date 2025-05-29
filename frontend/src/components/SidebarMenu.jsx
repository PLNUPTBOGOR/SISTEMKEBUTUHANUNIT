/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */


import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  LogOut,
  MapPin,
  ListOrdered,
  PlusCircle,
  Boxes,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function SidebarMenu({ user }) {
  const pathname = usePathname();

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition ${
      pathname === path ? "bg-gray-300 font-semibold" : ""
    }`;

  return (
    <aside className="bg-gray-100 w-64 h-full p-4 hidden lg:block border-r">
      <div className="text-center mb-4">
        <img
          src={user?.image}
          alt="Avatar"
          className="w-16 h-16 rounded-full mx-auto"
        />
        <h2 className="mt-2 font-bold">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.role}</p>
      </div>

      {user?.role === "ADMIN" && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase mb-1">Menu Admin</p>
          <nav className="flex flex-col gap-1">
            <Link href="/admin" className={linkClass("/admin")}>
              <LayoutDashboard size={18} /> Analitik
            </Link>
            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              <ListOrdered size={18} /> Semua Pesanan
            </Link>
            <Link href="/admin/categories" className={linkClass("/admin/categories")}>
              <Tags size={18} /> Kategori
            </Link>
            <Link href="/admin/sub-categories" className={linkClass("/admin/sub-categories")}>
              <Boxes size={18} /> Sub Kategori
            </Link>
            <Link href="/admin/add-product" className={linkClass("/admin/add-product")}>
              <PlusCircle size={18} /> Unggah Produk
            </Link>
            <Link href="/admin/products" className={linkClass("/admin/products")}>
              <Package size={18} /> Produk
            </Link>
          </nav>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 uppercase mb-1">Menu Saya</p>
        <nav className="flex flex-col gap-1">
          <Link href="/orders" className={linkClass("/orders")}>
            <ShoppingCart size={18} /> Pesanan Saya
          </Link>
          <Link href="/address" className={linkClass("/address")}>
            <MapPin size={18} /> Alamat
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 transition"
          >
            <LogOut size={18} /> Keluar
          </button>
        </nav>
      </div>
    </aside>
  );
}
