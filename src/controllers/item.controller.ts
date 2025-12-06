import { Request, Response } from "express"
import { AUthRequest } from "../middleware/auth"
import cloudinary from "../config/cloudinary"
import { Item, ItemStatus } from "../models/item.model"
import { log } from "console"
import { allCategoriesWithSubCategories } from "../models/category.model"

export const createItem = async (req: AUthRequest, res: Response) => {
  try {
    const {
      itemName,
      itemPrice,
      itemDescription,
      itemCategory,
      itemSubCategory,
      location,
      condition
    } = req.body

    // Handle multiple file uploads
    const imageURLs: string[] = []
    const files = req.files as Express.Multer.File[]

    if (files && files.length > 0) {
      if (files.length > 10) {
        return res.status(400).json({ message: "Maximum 10 images allowed" })
      }

      // Upload all images to cloudinary
      for (const file of files) {
        const result: any = await new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { folder: "items" },
            (error, result) => {
              if (error) {
                return reject(error)
              }
              resolve(result)
            }
          )
          upload_stream.end(file.buffer)
        })
        imageURLs.push(result.secure_url)
      }
    } else {
      return res.status(400).json({ message: "At least one image is required" })
    }

    console.log("Uploaded Images:", imageURLs)

    const newItem = new Item({
      sellerId: req.user.sub, // From auth middleware
      itemName,
      itemPrice,
      itemDescription,
      itemImages: imageURLs,
      itemCategory,
      itemSubCategory,
      location,
      condition,
      status: ItemStatus.PENDING,
      isApproved: false
    })

    await newItem.save()

    res.status(201).json({
      message: "Item created successfully",
      data: newItem
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to create item" })
  }
}

export const getAllItems = async (req: AUthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { category, subCategory, status, minPrice, maxPrice, condition } = req.query
    log(req.query)
    const filter: any = {}
    filter.isApproved = true
    filter.status = ItemStatus.APPROVED
    if (category) filter.itemCategory = category
    if (subCategory) filter.itemSubCategory = subCategory
    if (status) filter.status = status
    if (condition) filter.condition = condition

    if (minPrice || maxPrice) {
      filter.itemPrice = {}
      if (minPrice) filter.itemPrice.$gte = Number(minPrice)
      if (maxPrice) filter.itemPrice.$lte = Number(maxPrice)
    }

    const items = await Item.find(filter)
      .populate("sellerId", "firstname lastname phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Item.countDocuments(filter)
    log("Total items:", total)
    res.status(200).json({
      message: "Items fetched successfully",
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch items" })
  }
}

export const getItemsByCategory = async (req: AUthRequest, res: Response) => {
  try {
    const { category, subCategory } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const filter: any = {
      itemCategory: category,
      status: ItemStatus.APPROVED,
      isApproved: true
    }

    if (subCategory) {
      filter.itemSubCategory = subCategory
    }

    const items = await Item.find(filter)
      .populate("sellerId", "firstname lastname phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Item.countDocuments(filter)

    res.status(200).json({
      message: "Items fetched successfully",
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch items by category" })
  }
}

export const editItem = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id
    const {
      itemName,
      itemPrice,
      itemDescription,
      itemCategory,
      itemSubCategory,
      location,
      condition,
      existingImages // Array of existing image URLs to keep
    } = req.body

    // Find the item and check ownership
    const item = await Item.findById(itemID)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (item.sellerId.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized to edit this item" })
    }

    // Handle image updates
    let imageURLs: string[] = []

    // Keep existing images if provided
    if (existingImages && Array.isArray(existingImages)) {
      imageURLs = existingImages
    }

    // Upload new images if any
    const files = req.files as Express.Multer.File[]
    if (files && files.length > 0) {
      if (imageURLs.length + files.length > 10) {
        return res.status(400).json({ message: "Maximum 10 images allowed" })
      }

      for (const file of files) {
        const result: any = await new Promise((resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            { folder: "items" },
            (error, result) => {
              if (error) {
                return reject(error)
              }
              resolve(result)
            }
          )
          upload_stream.end(file.buffer)
        })
        imageURLs.push(result.secure_url)
      }
    }

    const updateData: any = {
      itemName,
      itemPrice,
      itemDescription,
      itemCategory,
      itemSubCategory,
      location,
      condition
    }

    if (imageURLs.length > 0) {
      updateData.itemImages = imageURLs
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemID,
      updateData,
      { new: true, runValidators: true }
    ).populate("sellerId", "firstname lastname phone email")

    res.status(200).json({
      message: "Item updated successfully",
      data: updatedItem
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update item" })
  }
}

export const deleteItem = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id

    const item = await Item.findById(itemID)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Check ownership (sellers can only delete their own items)
    if (item.sellerId.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized to delete this item" })
    }

    await Item.findByIdAndDelete(itemID)

    res.status(200).json({
      message: "Item deleted successfully"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete item" })
  }
}

export const getItemById = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id

    const item = await Item.findById(itemID)
      .populate("sellerId", "firstname lastname phone email address")

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Increment view count
    await Item.findByIdAndUpdate(itemID, { $inc: { views: 1 } })

    res.status(200).json({
      message: "Item fetched successfully",
      data: item
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch item" })
  }
}

export const searchItems = async (req: AUthRequest, res: Response) => {
  try {
    const search = req.query.q as string
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    if (!search || typeof search !== "string") {
      return res.status(400).json({ message: "Search query parameter is required" })
    }

    // Use text search if index exists, otherwise use regex
    const items = await Item.find({
      $text: { $search: search },
      status: ItemStatus.APPROVED,
      isApproved: true
    })
      .populate("sellerId", "firstname lastname phone")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)

    const total = await Item.countDocuments({
      $text: { $search: search },
      status: ItemStatus.APPROVED,
      isApproved: true
    })

    res.status(200).json({
      message: "Search results",
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    })
  } catch (error) {
    console.error(error)
    // Fallback to regex search if text index doesn't exist
    try {
      const items = await Item.find({
        $or: [
          { itemName: { $regex: req.query.search as string, $options: "i" } },
          { itemDescription: { $regex: req.query.search as string, $options: "i" } }
        ],
        status: ItemStatus.APPROVED,
        isApproved: true
      })
        .populate("sellerId", "firstname lastname phone")
        .sort({ createdAt: -1 })
        .skip((parseInt(req.query.page as string) || 1 - 1) * (parseInt(req.query.limit as string) || 10))
        .limit(parseInt(req.query.limit as string) || 10)

      res.status(200).json({
        message: "Search results",
        data: items
      })
    } catch (fallbackError) {
      res.status(500).json({ message: "Failed to search items" })
    }
  }
}

// Admin endpoints
export const approveItem = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id

    const updatedItem = await Item.findByIdAndUpdate(
      itemID,
      {
        isApproved: true,
        status: ItemStatus.APPROVED
      },
      { new: true }
    )

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.status(200).json({
      message: "Item approved successfully",
      data: updatedItem
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to approve item" })
  }
}

export const rejectItem = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id

    const updatedItem = await Item.findByIdAndUpdate(
      itemID,
      {
        isApproved: false,
        status: ItemStatus.REJECTED
      },
      { new: true }
    )

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" })
    }

    res.status(200).json({
      message: "Item rejected",
      data: updatedItem
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to reject item" })
  }
}

export const markAsSold = async (req: AUthRequest, res: Response) => {
  try {
    const itemID = req.params.id

    const item = await Item.findById(itemID)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (item.sellerId.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemID,
      { status: ItemStatus.SOLD },
      { new: true }
    )

    res.status(200).json({
      message: "Item marked as sold",
      data: updatedItem
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to mark item as sold" })
  }
}
// ge categories and subcategories from allCategoriesWithSubCategories
export const getAllCategories = async (req: AUthRequest, res: Response) => {
  console.log(allCategoriesWithSubCategories)
  try {
    res.status(200).json({
      message: "Categories fetched successfully",
      data: allCategoriesWithSubCategories
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch categories" })
  }
}
