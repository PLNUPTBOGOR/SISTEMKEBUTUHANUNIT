/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react";
import axios from "../utils/Axios";
import { useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import logo from "../assets/Logo_PLN.png";

const SuratJalanPage = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Editable fields states
  const [purpose, setPurpose] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [accordingToRequest, setaccordingToRequest] = useState("");
  const [items, setItems] = useState([]);
  const [suratJalanNumber, setSuratJalanNumber] = useState("");
  const [receiver, setReceiver] = useState("");
  const [approver, setApprover] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/order/${orderId}`);
        const orderData = res.data.data;

        setOrder(orderData);

        setPurpose(orderData.purpose || "");
        setRequestedBy(orderData.requestedBy || "");
        setaccordingToRequest(orderData.accordingToRequest || "");
        setReceiver(orderData.receiver || "");
        setApprover(orderData.approver || "");
        setVehicle(orderData.vehicle || "");
        setDriver(orderData.driver || "");

        // Pastikan items ada dan tambahkan notes default jika belum ada
        const mappedItems = (orderData.items || []).map((item) => ({
          ...item,
          notes: item.notes || "",
        }));
        setItems(mappedItems);

        // Generate nomor Surat Jalan
        if (orderData.orderDate) {
          const orderDate = parseISO(orderData.orderDate);
          const month = format(orderDate, "MM");
          const year = format(orderDate, "yyyy");
          const seqNum =
            orderData.suratJalanSequence ||
            (orderData._id ? parseInt(orderData._id.slice(-3), 10) : 1) ||
            1;
          const formattedNumber = `${seqNum
            .toString()
            .padStart(3, "0")}/MUM/UPTBGOR/${month}/${year}`;
          setSuratJalanNumber(formattedNumber);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-6">Memuat data Surat Jalan...</div>;
  if (!order) return <div className="p-6">Order tidak ditemukan.</div>;

  // Filter hanya item yang sudah disetujui (approvedQuantity > 0)
  const approvedItems = items.filter((item) => (item.approvedQuantity || 0) > 0);

  // Format tanggal order
  const orderDate = order.orderDate ? parseISO(order.orderDate) : new Date();
  const formattedDate = format(orderDate, "'Bogor,' dd MMMM yyyy", {
    locale: id,
  });

  // Handler notes tiap item
  const handleItemNoteChange = (index, newNote) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].notes = newNote;
      return newItems;
    });
  };

  // Simpan data surat jalan
  const handleSave = async () => {
    try {
      const payload = {
        purpose,
        requestedBy,
        accordingToRequest,
        items: items.map((item) => ({
          _id: item._id,
          notes: item.notes,
          approvedQuantity: item.approvedQuantity,
          productName: item.productName,
        })),
        suratJalanNumber,
        receiver,
        approver,
        vehicle,
        driver,
      };

      console.log("Payload yang dikirim:", payload);

      await axios.put(`/api/order/${orderId}/invoice-suratjalan`, payload);

      alert("Data Surat Jalan berhasil disimpan");
      setEditMode(false);

      // Update local state order biar langsung update di UI
      setOrder((prev) => ({
        ...prev,
        purpose,
        requestedBy,
        accordingToRequest,
        items: payload.items,
        suratJalanNumber,
        receiver,
        approver,
        vehicle,
        driver,
      }));
    } catch (error) {
      console.error("Error saat simpan Surat Jalan:", error.response?.data || error.message);
      AxiosToastError(error);
    }
  };

  return (
    <div className="print-area p-4 sm:p-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 gap-4">
        <img src={logo} alt="logo PLN" className="w-16 h-16" />
        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-xl font-bold">
            {order.companyName || "PT. PLN (PERSERO) UIT JAWA BAGIAN TENGAH"}
          </h1>
          <h2 className="text-base sm:text-lg">{order.unitName || "UPT BOGOR"}</h2>
        </div>
      </div>

      <h1 className="text-center font-bold text-xl sm:text-2xl mb-4">SURAT JALAN</h1>

      <p className="text-center font-semibold mb-6 text-sm sm:text-base">
        NO :{" "}
        {editMode ? (
          <input
            type="text"
            className="border border-gray-400 p-1 rounded inline-block w-full sm:w-60 text-center"
            value={suratJalanNumber}
            onChange={(e) => setSuratJalanNumber(e.target.value)}
          />
        ) : (
          suratJalanNumber
        )}
      </p>

      {/* Body */}
      <div className="mb-6">
        <p className="mb-2">Mohon diizinkan membawa barang-barang tersebut di bawah ini :</p>

        {/* Editable purpose */}
        <div className="flex mb-1 items-center">
          <span className="w-full sm:w-40 font-semibold">Untuk Keperluan</span>
          {editMode ? (
            <input
              type="text"
              className="border border-gray-400 p-1 rounded flex-grow w-full sm:w-auto"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          ) : (
            <span>{purpose || " : -"}</span>
          )}
        </div>

        {/* Editable requestedBy */}
        <div className="flex mb-4 items-center">
          <span className="w-40 font-semibold">Tujuan</span>
          {editMode ? (
            <input
              type="text"
              className="border border-gray-400 p-1 rounded flex-grow"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
            />
          ) : (
            <span>{requestedBy || " : -"}</span>
          )}
        </div>
        {/* Editable accordingToRequest */}
        <div className="flex mb-4 items-center">
          <span className="w-40 font-semibold">Menurut Permintaan</span>
          {editMode ? (
            <input
              type="text"
              className="border border-gray-400 p-1 rounded flex-grow"
              value={accordingToRequest}
              onChange={(e) => setaccordingToRequest(e.target.value)}
            />
          ) : (
            <span>{accordingToRequest || " : -"}</span>
          )}
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-800 border-collapse mb-6 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-800 px-2 py-1 w-10">NO</th>
                <th className="border border-gray-800 px-2 py-1 text-left">NAMA BARANG</th>
                <th className="border border-gray-800 px-2 py-1 w-20">SATUAN</th>
                <th className="border border-gray-800 px-2 py-1 w-20">JUMLAH</th>
                <th className="border border-gray-800 px-2 py-1 text-left">KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              {approvedItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-2 border border-gray-800">
                    Tidak ada item yang disetujui.
                  </td>
                </tr>
              )}
              {approvedItems.map((item, idx) => {
                const name = item.product_details?.name || item.productName || "-";
                return (
                  <tr key={item._id || idx}>
                    <td className="border border-gray-800 px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border border-gray-800 px-2 py-1">{name}</td>
                    <td className="border border-gray-800 px-2 py-1 text-center">unit</td>
                    <td className="border border-gray-800 px-2 py-1 text-center">{item.approvedQuantity}</td>
                    <td className="border border-gray-800 px-2 py-1">
                      {editMode ? (
                        <input
                          type="text"
                          className="w-full border border-gray-400 rounded p-1"
                          value={item.notes}
                          onChange={(e) => handleItemNoteChange(idx, e.target.value)}
                          placeholder="Keterangan"
                        />
                      ) : (
                        item.notes || "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Vehicle info */}
        <div className="mb-1 flex items-center">
          <span className="w-40 font-semibold">Kendaraan</span>
          {editMode ? (
            <input
              type="text"
              className="border border-gray-400 p-1 rounded flex-grow"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />
          ) : (
            <span>{vehicle || ": -"}</span>
          )}
        </div>

        <div className="mb-6 flex items-center">
          <span className="w-40 font-semibold">Pengemudi</span>
          {editMode ? (
            <input
              type="text"
              className="border border-gray-400 p-1 rounded flex-grow"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            />
          ) : (
            <span>{driver || ": -"}</span>
          )}
        </div>

        {/* Date */}
        <div className="text-right font-semibold mb-6">{formattedDate}</div>

        {/* Signatures (editable) */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 gap-6">
          <div className="text-center flex-1">
            <p>Yang Menerima</p>
            {editMode ? (
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-full text-center"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
            ) : (
              <div className="border-t border-black mt-12 pt-2">{receiver || "-"}</div>
            )}
          </div>

          <div className="text-center flex-1">
            <p>Yang Mengijinkan</p>
            {editMode ? (
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-full text-center"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
              />
            ) : (
              <div className="border-t border-black mt-12 pt-2">{approver || "-"}</div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons
      <div className="flex justify-center gap-4 mt-8">
        {editMode ? (
          <>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              onClick={handleSave}
            >
              Simpan
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-black px-6 py-2 rounded"
              onClick={() => setEditMode(false)}
            >
              Batal
            </button>
          </>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            onClick={() => setEditMode(true)}
          >
            Edit Surat Jalan
          </button>
          
        )} */}

        
    {/* Buttons */}
       <div className="flex justify-end space-x-3">
         {editMode ? (
           <>
             <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditMode(true)}
              className="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Surat Jalan
            </button>
            <button
              onClick={() => window.print()}
              className="no-print  bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Cetak Surat Jalan
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuratJalanPage;



// import React, { useEffect, useState } from "react";
// import axios from "../utils/Axios";
// import { useParams } from "react-router-dom";
// import AxiosToastError from "../utils/AxiosToastError";
// import { format, parseISO } from "date-fns";
// import { id } from "date-fns/locale";
// import logo from "../assets/logo_PLN.png";

// const SuratJalanPage = () => {
//   const { orderId } = useParams();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);

//   // Editable fields states
//   const [purpose, setPurpose] = useState("");
//   const [requestedBy, setRequestedBy] = useState("");
//   const [accordingToRequest, setaccordingToRequest] = useState("");
//   const [items, setItems] = useState([]);
//   const [suratJalanNumber, setSuratJalanNumber] = useState("");
//   const [receiver, setReceiver] = useState("");
//   const [approver, setApprover] = useState("");
//   const [vehicle, setVehicle] = useState("");
//   const [driver, setDriver] = useState("");
  

//   useEffect(() => {
//     const fetchOrder = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`/api/order/${orderId}`);
//         const orderData = res.data.data;
//         setOrder(orderData);
//         setPurpose(orderData.purpose || "");
//         setRequestedBy(orderData.requestedBy || "");
//         setaccordingToRequest(orderData.accordingToRequest || "");
//         setItems(
//           orderData.items.map((item) => ({
//             ...item,
//             notes: item.notes || "",
//           }))
//         );
//         setReceiver(orderData.receiver || "");
//         setApprover(orderData.approver || "");
//         setVehicle(orderData.vehicle || "");
//         setDriver(orderData.driver || "");

//         if (orderData.orderDate) {
//           const orderDate = parseISO(orderData.orderDate);
//           const month = format(orderDate, "MM");
//           const year = format(orderDate, "yyyy");
//           const seqNum =
//             orderData.suratJalanSequence ||
//             (orderData._id ? parseInt(orderData._id.slice(-3)) : 1) ||
//             1;
//           const formattedNumber = `${seqNum
//             .toString()
//             .padStart(3, "0")}/MUM/UPTBGOR/${month}/${year}`;
//           setSuratJalanNumber(formattedNumber);
//         }
//       } catch (error) {
//         AxiosToastError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (orderId) fetchOrder();
//   }, [orderId]);

//   if (loading) return <div className="p-6">Memuat data Surat Jalan...</div>;
//   if (!order) return <div className="p-6">Order tidak ditemukan.</div>;

//   // Filter approved items
//   const approvedItems = items.filter(
//     (item) => (item.approvedQuantity || 0) > 0
//   );

//   // Format date for display
//   const orderDate = order.orderDate ? parseISO(order.orderDate) : new Date();
//   const formattedDate = format(orderDate, "'Bogor,' dd MMMM yyyy", {
//     locale: id,
//   });

//   // Handlers for editing notes per item
//   const handleItemNoteChange = (index, newNote) => {
//     setItems((prevItems) => {
//       const newItems = [...prevItems];
//       newItems[index].notes = newNote;
//       return newItems;
//     });
//   };

//   // Submit updated data to backend
//   const handleSave = async () => {
//     try {
//       const payload = {
//         purpose,
//         requestedBy,
//         accordingToRequest,
//         items: items.map((item) => ({
//           ...item,
//           notes: item.notes,
//         })),
//         suratJalanNumber,
//         receiver,
//         approver,
//         vehicle,
//         driver,
//       };

//       console.log("Payload yang dikirim:", payload);

//       await axios.put(`/api/order/${orderId}/invoice-suratjalan`, payload);

//       alert("Data Surat Jalan berhasil disimpan");
//       setEditMode(false);

//       setOrder((prev) => ({
//         ...prev,
//         purpose,
//         requestedBy,
//         accordingToRequest,
//         items: payload.items,
//         suratJalanNumber,
//         receiver,
//         approver,
//         vehicle,
//         driver,
//       }));
//     } catch (error) {
//       console.error(
//         "Error saat simpan Surat Jalan:",
//         error.response?.data || error.message
//       );
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <div className="print-area p-4 sm:p-6 max-w-screen-lg mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 gap-4">
//         <img src={logo} alt="logo PLN" className="w-16 h-16" />
//         <div className="text-center sm:text-left">
//           <h1 className="text-lg sm:text-xl font-bold">
//             {order.companyName || "PT. PLN (PERSERO) UIT JAWA BAGIAN TENGAH"}
//           </h1>
//           <h2 className="text-base sm:text-lg">
//             {order.unitName || "UPT BOGOR"}
//           </h2>
//         </div>
//       </div>

//       <h1 className="text-center font-bold text-xl sm:text-2xl mb-4">
//         SURAT JALAN
//       </h1>

//       <p className="text-center font-semibold mb-6 text-sm sm:text-base">
//         NO :{" "}
//         {/* {editMode ? (
//           <input
//             type="text"
//             className="border border-gray-400 p-1 rounded inline-block w-full sm:w-60 text-center"
//             value={suratJalanNumber}
//             onChange={(e) => setSuratJalanNumber(e.target.value)}
//           />
//         ) : (
//           suratJalanNumber
//         )} */}
//         <span className="inline-block w-full sm:w-60 text-center border border-gray-300 p-1 rounded bg-gray-100">
//           {suratJalanNumber || "Belum tersedia"}
//         </span>
//       </p>

//       {/* Body */}
//       <div className="mb-6">
//         <p className="mb-2">
//           Mohon diizinkan membawa barang-barang tersebut di bawah ini :
//         </p>

//         {/* Editable purpose */}
//         <div className="flex flex-mb-1 items-center">
//           <span className="w-full sm:w-40 font-semibold">Untuk Keperluan</span>
//           {editMode ? (
//             <input
//               type="text"
//               className="border border-gray-400 p-1 rounded flex-grow w-full sm:w-auto"
//               value={purpose}
//               onChange={(e) => setPurpose(e.target.value)}
//             />
//           ) : (
//             <span>{purpose || " : -"}</span>
//           )}
//         </div>

//         {/* Editable requestedBy */}
//         <div className="flex mb-4 items-center">
//           <span className="w-40 font-semibold">Tujuan</span>
//           {editMode ? (
//             <input
//               type="text"
//               className="border border-gray-400 p-1 rounded flex-grow"
//               value={requestedBy}
//               onChange={(e) => setRequestedBy(e.target.value)}
//             />
//           ) : (
//             <span>{requestedBy || " : -"}</span>
//           )}
//         </div>
//         {/* Editable requestedBy */}
//         <div className="flex mb-4 items-center">
//           <span className="w-40 font-semibold">Menurut Permintaan</span>
//           {editMode ? (
//             <input
//               type="text"
//               className="border border-gray-400 p-1 rounded flex-grow"
//               value={accordingToRequest}
//               onChange={(e) => setaccordingToRequest(e.target.value)}
//             />
//           ) : (
//             <span>{requestedBy || " : -"}</span>
//           )}
//         </div>

//         {/* Items Table */}
//         <div className="overflow-x-auto mb-6">
//           <table className="min w-full border border-gray-800 border-collapse mb-6 text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border border-gray-800 px-2 py-1 w-10">NO</th>
//                 <th className="border border-gray-800 px-2 py-1 text-left">
//                   NAMA BARANG
//                 </th>
//                 <th className="border border-gray-800 px-2 py-1 w-20">
//                   SATUAN
//                 </th>
//                 <th className="border border-gray-800 px-2 py-1 w-20">
//                   JUMLAH
//                 </th>
//                 <th className="border border-gray-800 px-2 py-1 text-left">
//                   KETERANGAN
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedItems.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="text-center p-2 border border-gray-800"
//                   >
//                     Tidak ada item yang disetujui.
//                   </td>
//                 </tr>
//               )}
//               {approvedItems.map((item, idx) => {
//                 const name =
//                   item.product_details?.name || item.productName || "-";
//                 return (
//                   <tr key={item._id || idx}>
//                     <td className="border border-gray-800 px-2 py-1 text-center">
//                       {idx + 1}
//                     </td>
//                     <td className="border border-gray-800 px-2 py-1">{name}</td>
//                     <td className="border border-gray-800 px-2 py-1 text-center">
//                       unit
//                     </td>

//                     <td className="border border-gray-800 px-2 py-1 text-center">
//                       {item.approvedQuantity}
//                     </td>
//                     <td className="border border-gray-800 px-2 py-1">
//                       {editMode ? (
//                         <input
//                           type="text"
//                           className="w-full border border-gray-400 rounded p-1"
//                           value={item.notes}
//                           onChange={(e) =>
//                             handleItemNoteChange(idx, e.target.value)
//                           }
//                           placeholder="Keterangan"
//                         />
//                       ) : (
//                         item.notes || "-"
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Vehicle info */}
//         <div className="mb-1 flex items-center">
//           <span className="w-40 font-semibold">Kendaraan</span>
//           {editMode ? (
//             <input
//               type="text"
//               className="border border-gray-400 p-1 rounded flex-grow"
//               value={vehicle}
//               onChange={(e) => setVehicle(e.target.value)}
//             />
//           ) : (
//             <span>{vehicle || ": -"}</span>
//           )}
//         </div>

//         <div className="mb-6 flex items-center">
//           <span className="w-40 font-semibold">Pengemudi</span>
//           {editMode ? (
//             <input
//               type="text"
//               className="border border-gray-400 p-1 rounded flex-grow"
//               value={driver}
//               onChange={(e) => setDriver(e.target.value)}
//             />
//           ) : (
//             <span>{driver || ": -"}</span>
//           )}
//         </div>

//         {/* Date */}
//         <div className="text-right font-semibold mb-6">{formattedDate}</div>

//         {/* Signatures (editable) */}
//         <div className="flex flex-col sm:flex-row justify-between mt-8 gap-6">
//           <div className="text-center flex-1">
//             <p>Yang Menerima</p>
//             {editMode ? (
//               <input
//                 type="text"
//                 className="border border-gray-400 rounded p-1 w-full text-center"
//                 value={receiver}
//                 onChange={(e) => setReceiver(e.target.value)}
//               />
//             ) : (
//               <div className="border-t border-black mt-12 pt-2">
//                 {receiver || "-"}
//               </div>
//             )}
//           </div>

//           <div className="text-center flex-1">
//             <p>Yang Mengijinkan</p>
//             {editMode ? (
//               <input
//                 type="text"
//                 className="border border-gray-400 rounded p-1 w-full text-center"
//                 value={approver}
//                 onChange={(e) => setApprover(e.target.value)}
//               />
//             ) : (
//               <div className="border-t border-black mt-12 pt-2">
//                 {approver || "-"}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end space-x-3">
//         {editMode ? (
//           <>
//             <button
//               onClick={handleSave}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Simpan
//             </button>
//             <button
//               onClick={() => setEditMode(false)}
//               className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//             >
//               Batal
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={() => setEditMode(true)}
//               className="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Edit Surat Jalan
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="no-print  bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//             >
//               Cetak Surat Jalan
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuratJalanPage;



// import React, { useState } from "react";
// import logo from "../assets/logo_PLN.png"; // pastikan ada file logo ini atau ganti pathnya

// const SuratJalanPage = () => {
//   // Simulasi data awal (bisa diubah sesuai data sebenarnya)
//   const [order, setOrder] = useState({
//     companyName: "PT. PLN (PERSERO) UIT JAWA BAGIAN TENGAH",
//     unitName: "UPT BOGOR",
//     orderDate: new Date().toISOString(),
//   });

//   const [editMode, setEditMode] = useState(false);

//   // Editable fields states
//   const [purpose, setPurpose] = useState("Perbaikan jaringan listrik");
//   const [requestedBy, setRequestedBy] = useState("Unit Maintenance");
//   const [accordingToRequest, setAccordingToRequest] = useState("Sesuai kebutuhan teknis");
//   const [items, setItems] = useState([
//     { id: 1, productName: "Kabel Listrik", approvedQuantity: 10, notes: "" },
//     { id: 2, productName: "Isolator", approvedQuantity: 5, notes: "" },
//   ]);
//   const [suratJalanNumber, setSuratJalanNumber] = useState("001/MUM/UPTBGOR/05/2025");
//   const [receiver, setReceiver] = useState("Budi Santoso");
//   const [approver, setApprover] = useState("Andi Wijaya");
//   const [vehicle, setVehicle] = useState("Mobil Pickup");
//   const [driver, setDriver] = useState("Slamet");

//   // Handle notes edit per item
//   const handleItemNoteChange = (index, value) => {
//     const newItems = [...items];
//     newItems[index].notes = value;
//     setItems(newItems);
//   };

//   // Save handler (mock)
//   const handleSave = () => {
//     alert("Data berhasil disimpan!");
//     setEditMode(false);
//   };

//   // Format date
//   const formatDate = (isoDate) => {
//     const d = new Date(isoDate);
//     return d.toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="print-area p-4 max-w-screen-md mx-auto font-sans">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <img src={logo} alt="logo PLN" className="w-16 h-16 object-contain" />
//         <div>
//           <h1 className="text-xl font-bold">{order.companyName}</h1>
//           <h2 className="text-lg">{order.unitName}</h2>
//         </div>
//       </div>

//       <h1 className="text-center font-extrabold text-2xl mb-4">SURAT JALAN</h1>

//       <p className="text-center font-semibold mb-6 text-base">
//         NO:{" "}
//         <span className="inline-block w-full sm:w-60 text-center border border-gray-300 p-1 rounded bg-gray-100">
//           {suratJalanNumber}
//         </span>
//       </p>

//       <p className="mb-4">
//         Mohon diizinkan membawa barang-barang tersebut di bawah ini :
//       </p>

//       {/* Purpose */}
//       <div className="flex items-center mb-2">
//         <span className="w-40 font-semibold">Untuk Keperluan</span>
//         {editMode ? (
//           <input
//             type="text"
//             className="border p-1 rounded flex-grow"
//             value={purpose}
//             onChange={(e) => setPurpose(e.target.value)}
//           />
//         ) : (
//           <span>{purpose || "-"}</span>
//         )}
//       </div>

//       {/* Requested By */}
//       <div className="flex items-center mb-2">
//         <span className="w-40 font-semibold">Tujuan</span>
//         {editMode ? (
//           <input
//             type="text"
//             className="border p-1 rounded flex-grow"
//             value={requestedBy}
//             onChange={(e) => setRequestedBy(e.target.value)}
//           />
//         ) : (
//           <span>{requestedBy || "-"}</span>
//         )}
//       </div>

//       {/* According To Request */}
//       <div className="flex items-center mb-4">
//         <span className="w-40 font-semibold">Menurut Permintaan</span>
//         {editMode ? (
//           <input
//             type="text"
//             className="border p-1 rounded flex-grow"
//             value={accordingToRequest}
//             onChange={(e) => setAccordingToRequest(e.target.value)}
//           />
//         ) : (
//           <span>{accordingToRequest || "-"}</span>
//         )}
//       </div>

//       {/* Items Table */}
//       <div className="overflow-x-auto mb-6">
//         <table className="w-full border border-gray-700 border-collapse text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border border-gray-700 px-2 py-1 w-10">NO</th>
//               <th className="border border-gray-700 px-2 py-1 text-left">
//                 NAMA BARANG
//               </th>
//               <th className="border border-gray-700 px-2 py-1 w-20">SATUAN</th>
//               <th className="border border-gray-700 px-2 py-1 w-20">JUMLAH</th>
//               <th className="border border-gray-700 px-2 py-1 text-left">
//                 KETERANGAN
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-2 border border-gray-700">
//                   Tidak ada item yang disetujui.
//                 </td>
//               </tr>
//             ) : (
//               items.map((item, idx) => (
//                 <tr key={item.id}>
//                   <td className="border border-gray-700 px-2 py-1 text-center">{idx + 1}</td>
//                   <td className="border border-gray-700 px-2 py-1">{item.productName}</td>
//                   <td className="border border-gray-700 px-2 py-1 text-center">unit</td>
//                   <td className="border border-gray-700 px-2 py-1 text-center">{item.approvedQuantity}</td>
//                   <td className="border border-gray-700 px-2 py-1">
//                     {editMode ? (
//                       <input
//                         type="text"
//                         className="w-full border border-gray-400 rounded p-1"
//                         value={item.notes}
//                         onChange={(e) => handleItemNoteChange(idx, e.target.value)}
//                         placeholder="Keterangan"
//                       />
//                     ) : (
//                       item.notes || "-"
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Vehicle & Driver */}
//       <div className="mb-2 flex items-center">
//         <span className="w-40 font-semibold">Kendaraan</span>
//         {editMode ? (
//           <input
//             type="text"
//             className="border p-1 rounded flex-grow"
//             value={vehicle}
//             onChange={(e) => setVehicle(e.target.value)}
//           />
//         ) : (
//           <span>{vehicle || "-"}</span>
//         )}
//       </div>

//       <div className="mb-6 flex items-center">
//         <span className="w-40 font-semibold">Pengemudi</span>
//         {editMode ? (
//           <input
//             type="text"
//             className="border p-1 rounded flex-grow"
//             value={driver}
//             onChange={(e) => setDriver(e.target.value)}
//           />
//         ) : (
//           <span>{driver || "-"}</span>
//         )}
//       </div>

//       {/* Date */}
//       <div className="text-right font-semibold mb-6">
//         {formatDate(order.orderDate)}
//       </div>

//       {/* Signatures */}
//       <div className="flex flex-col sm:flex-row justify-between gap-6 mt-8">
//         <div className="text-center flex-1">
//           <p>Yang Menerima</p>
//           {editMode ? (
//             <input
//               type="text"
//               className="border p-1 rounded w-full text-center"
//               value={receiver}
//               onChange={(e) => setReceiver(e.target.value)}
//             />
//           ) : (
//             <div className="border-t border-black mt-12 pt-2">{receiver || "-"}</div>
//           )}
//         </div>

//         <div className="text-center flex-1">
//           <p>Yang Mengijinkan</p>
//           {editMode ? (
//             <input
//               type="text"
//               className="border p-1 rounded w-full text-center"
//               value={approver}
//               onChange={(e) => setApprover(e.target.value)}
//             />
//           ) : (
//             <div className="border-t border-black mt-12 pt-2">{approver || "-"}</div>
//           )}
//         </div>
//       </div>

//       {/* Edit/Save Buttons */}
//       <div className="mt-8 text-center">
//         {editMode ? (
//           <>
//             <button
//               onClick={handleSave}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
//             >
//               Simpan
//             </button>
//             <button
//               onClick={() => setEditMode(false)}
//               className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Batal
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => setEditMode(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Edit Surat Jalan
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuratJalanPage;
