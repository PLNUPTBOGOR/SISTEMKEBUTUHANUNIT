/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-black",
  className = "",
}) => {
  return (
    <div
      className={`min-w-[200px] md:min-w-[250px] p-4 rounded-2xl shadow-md ${bgColor} ${textColor} flex items-center justify-between ${className}`}
    >
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl md:text-4xl">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;

