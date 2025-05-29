import UserModel from '../models/M_user.js';
import ProductModel from '../models/M_product.js';
import OrderModel from '../models/M_order.js';
import CategoryModel from '../models/M_category.js';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fungsi untuk mengambil data analitik
export const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();
    const totalRequests = await OrderModel.countDocuments({ status: "Diajukan" });

    // Mendapatkan top-selling items
    const topSellingItems = await OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $project: {
          productName: { $arrayElemAt: ["$product.name", 0] },
          totalSold: 1
        }
      }
    ]);

    // Mendapatkan tren request berdasarkan bulan dan tahun
    const requestTrendsRaw = await OrderModel.aggregate([
      { $match: { status: "Diajukan" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const requestTrends = requestTrendsRaw.map(item => ({
      label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    // Mendapatkan top kategori berdasarkan jumlah barang terjual
    const topCategories = await OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $project: {
          categoryName: { $arrayElemAt: ["$category.name", 0] },
          totalSold: 1
        }
      }
    ]);

    // Mendapatkan breakdown status pesanan (pie chart)
    const statusBreakdownRaw = await OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusBreakdown = statusBreakdownRaw.map(item => ({
      status: item._id,
      count: item.count
    }));

    // Mendapatkan unit dengan request terbanyak
    const topRequestUnits = await OrderModel.aggregate([
      { $match: { status: "Diajukan" } },
      {
        $group: {
          _id: "$unit_name",
          totalRequests: { $sum: 1 }
        }
      },
      { $sort: { totalRequests: -1 } },
      { $limit: 5 }
    ]);

    // Mendapatkan semua pesanan beserta informasi terkait (untuk tabel orders)
    const allOrdersRaw = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("items.productId", "name")
      .populate("delivery_address", "address_line"); // Populate delivery_address untuk street

    const allOrders = allOrdersRaw.map(order => {
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        orderId: order._id,
        name: order.userId?.name || "Unknown",
        email: order.userId?.email || "Unknown",
        userId: order.userId?._id || "Unknown",
        address: order.delivery_address?.address_line || "-",
        totalQuantity,
        status: order.status,
        orderDate: order.createdAt,
      };
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRequests,
      topSellingItems,
      requestTrends,
      topCategories,
      statusBreakdown,
      topRequestUnits,
      allOrders
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

