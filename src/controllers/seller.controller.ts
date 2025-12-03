import { Response } from "express"
import { AUthRequest } from "../middleware/auth"
import { Item } from "../models/item.model"


export const getMyItems = async (req: AUthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const items = await Item.find({ sellerId: req.user.sub })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    const total = await Item.countDocuments({ sellerId: req.user.sub })
    res.status(200).json({
      message: "Your items fetched successfully",
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch your items" })
  }
}