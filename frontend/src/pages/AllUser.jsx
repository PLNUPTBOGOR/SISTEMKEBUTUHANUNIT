/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react";
import axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // mulai false, langsung di fetch
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/user/all");
      // Data bisa ada di res.data.data atau res.data langsung
      setUsers(res.data.data || res.data);
    } catch (err) {
      setError("Gagal memuat data pengguna.");
      AxiosToastError(err);
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
      </div>

      <div className="overflow-auto w-full max-w-[95vw] max-h-[60vh] border border-gray-300 rounded-md">
        {error && (
          <p className="text-red-600 p-4">{error}</p>
        )}

        {!loading && users.length === 0 && !error && (
          <p className="p-4 text-gray-600">Tidak ada pengguna ditemukan.</p>
        )}

        {!loading && users.length > 0 && (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id || user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    alert(`Detail pengguna:\n\nNama: ${user.name}\nEmail: ${user.email}`)
                  }
                >
                  <td className="border border-gray-300 px-4 py-2 break-all">{user._id || user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {loading && (
          <p className="p-4 text-gray-500">Memuat data pengguna...</p>
        )}
      </div>
    </section>
  );
};

export default AllUsers;
