/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */


import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEnvelope, FaPhone, FaUserEdit } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);

  return (
    <div className="bg-white px-4 py-6 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Avatar section */}
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative group mx-auto md:mx-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex justify-center items-center text-blue-600">
                <FaRegUserCircle size={100} />
              </div>
            )}
            <button
              onClick={() => setProfileAvatarEdit(true)}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-blue-700 transition"
              title="Edit Foto"
            >
              <FaUserEdit size={16} />
            </button>
          </div>
          <p className="text-center mt-4 text-xl font-semibold text-black">{user.name}</p>
        </div>

        {/* Info section */}
        <div className="flex-1 grid gap-5">
          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              Informasi Akun
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-black">
                <FaEnvelope />
                <span>{user.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 text-black">
                <FaPhone />
                <span>{user.mobile || "-"}</span>
              </div>
            </div>
          </div>

          <div>
            <a
              href="/dashboard/edit-profile"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}
    </div>
  );
};

export default Profile;
