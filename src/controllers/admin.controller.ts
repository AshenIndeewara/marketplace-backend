import e, { Response } from "express"
import { AUthRequest } from "../middleware/auth"
import { Item } from "../models/item.model"
import { Role, User } from "../models/user.model"


export const getAllItemsAdmin = async (req: AUthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    const total = await Item.countDocuments()
    res.status(200).json({
        message: "All items fetched successfully",
        data: items,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total
        }
    })
    } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch items" })
    }
}

export const getAllUsers = async (req: AUthRequest, res: Response) => {
    try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const items = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    const total = await User.countDocuments()
    res.status(200).json({
        message: "All users fetched successfully",
        data: items,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCount: total
        }
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch users" })
    }
}

//make as a admin
export const makeUserAdmin = async (req: AUthRequest, res: Response) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.roles = Array.from(new Set([...user.roles, Role.ADMIN]))
        await user.save()
        res.status(200).json({ message: "User role updated to admin successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to update user role" })
    }
}

// remove admin role from user
export const removeUserAdmin = async (req: AUthRequest, res: Response) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.roles = user.roles.filter(role => role !== Role.ADMIN)
        await user.save()
        res.status(200).json({ message: "User admin role removed successfully" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to remove user admin role" })
    }
}