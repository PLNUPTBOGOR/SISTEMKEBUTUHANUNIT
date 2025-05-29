import SuratJalanModel from "../models/M_suratJalan.js";
import mongoose from "mongoose";


// Fungsi bantu untuk generate nomor surat otomatis
const generateNomorSurat = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Bulan 1–12
  const bulanTahun = `${year}${month}`; // Hasil: 202505
  const prefix = `SJ-${bulanTahun}-`;

  const lastSurat = await SuratJalanModel.findOne({
    nomorSurat: { $regex: `^${prefix}` }
  }).sort({ createdAt: -1 });

  let nomorUrut = 1;
  if (lastSurat) {
    const lastNomor = parseInt(lastSurat.nomorSurat.slice(-3));
    nomorUrut = lastNomor + 1;
  }

  return `${prefix}${nomorUrut.toString().padStart(3, '0')}`;
};

// ✅ Buat surat jalan baru
export const createSuratJalanController = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId, penerima, sopir, penandatangan, tanggalKirim, catatan } = req.body;

    if (!orderId || !penerima || !sopir || !penandatangan || !tanggalKirim) {
      return res.status(400).json({
        message: "Semua field (orderId, penerima, sopir, penandatangan, tanggalKirim) wajib diisi",
        success: false,
        error: true,
      });
    }

    const nomorSurat = await generateNomorSurat();

    const newSurat = new SuratJalanModel({
      nomorSurat,
      orderId,
      penerima,
      sopir,
      penandatangan,
      tanggalKirim,
      catatan: catatan || "",
      createdBy: userId,
    });

    const save = await newSurat.save();

    return res.status(201).json({
      message: "Surat jalan berhasil dibuat",
      success: true,
      error: false,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Terjadi kesalahan saat membuat surat jalan",
      success: false,
      error: true,
    });
  }
};

// ✅ Update surat jalan berdasarkan orderId
export const updateSuratJalanController = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { penerima, sopir, penandatangan, tanggalKirim, catatan } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "orderId diperlukan",
        success: false,
        error: true,
      });
    }

    const update = await SuratJalanModel.findOneAndUpdate(
      { orderId },
      {
        penerima,
        sopir,
        penandatangan,
        tanggalKirim,
        catatan,
        updatedBy: userId,
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({
        message: "Surat jalan tidak ditemukan",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Surat jalan berhasil diperbarui",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Gagal memperbarui surat jalan",
      success: false,
      error: true,
    });
  }
};

// ✅ Ambil surat jalan berdasarkan orderId
export const getSuratJalanByOrderIdController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "orderId diperlukan",
        success: false,
        error: true,
      });
    }

    const surat = await SuratJalanModel.findOne({ orderId });

    if (!surat) {
      return res.status(404).json({
        message: "Surat jalan tidak ditemukan",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Data surat jalan berhasil ditemukan",
      success: true,
      error: false,
      data: surat,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Terjadi kesalahan saat mengambil surat jalan",
      success: false,
      error: true,
    });
  }
};
