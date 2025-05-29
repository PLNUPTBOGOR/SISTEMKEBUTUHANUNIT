

import ProductModel from "../models/M_product.js";

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock = 0,
      description,
      more_details = {},
    } = req.body;

    if (
      !name ||
      !Array.isArray(image) ||
      image.length === 0 ||
      !Array.isArray(category) ||
      category.length === 0 ||
      !Array.isArray(subCategory) ||
      subCategory.length === 0 ||
      !unit ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
        error: true,
        success: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      description,
      more_details,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      data: savedProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// GET PRODUCTS (with pagination & search)
export const getProductController = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.body;

    const query = search
      ? { $text: { $search: search } }
      : {};

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product data retrieved successfully",
      error: false,
      success: true,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page,
      limit,
      data: products,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// GET PRODUCTS BY CATEGORY
export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Category id is required",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      category: { $in: [id] },
    }).limit(15).populate("category subCategory");

    return res.json({
      message: "Products by category retrieved successfully",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Get product by category error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// GET PRODUCTS BY CATEGORY & SUBCATEGORY (with pagination)
export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    let { categoryId, subCategoryId, page = 1, limit = 10 } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    const query = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
    };

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Products list retrieved successfully",
      data: products,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page,
      limit,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get products by category and subcategory error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// GET PRODUCT DETAILS BY ID
export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.findById(productId).populate("category subCategory");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Product details retrieved successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Get product details error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// UPDATE PRODUCT
export const updateProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product _id is required",
        error: true,
        success: false,
      });
    }

    const updated = await ProductModel.updateOne(
      { _id },
      { $set: { ...req.body } }
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Product updated successfully",
      data: updated,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// DELETE PRODUCT
export const deleteProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product _id is required",
        error: true,
        success: false,
      });
    }

    const deleted = await ProductModel.deleteOne({ _id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found or already deleted",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Product deleted successfully",
      data: deleted,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// SEARCH PRODUCT
export const searchProduct = async (req, res) => {
  try {
    let { search = "", page = 1, limit = 10 } = req.body;

    const query = search
      ? { $text: { $search: search } }
      : {};

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Search results retrieved successfully",
      error: false,
      success: true,
      data: products,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
      page,
      limit,
    });
  } catch (error) {
    console.error("Search product error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
