import { Response } from "express"
import { AUthRequest } from "../middleware/auth"
import { Item } from "../models/item.model"
import { User } from "../models/user.model"
import mongoose from "mongoose"


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

export const addFavoriteItem = async (req: AUthRequest, res: Response) => {
    try {
        const itemId = new mongoose.Types.ObjectId(req.params.itemId);
        const userId = req.user.sub;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.favoriteItems?.includes(itemId)) {
            return res.status(400).json({ message: "Item already in favorites" });
        }
        user.favoriteItems = user.favoriteItems || [];
        user.favoriteItems.push(itemId);
        await user.save();
        res.status(200).json({ message: "Item added to favorites successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add favorite item" });
    }
}

export const deleteFavoriteItem = async (req: AUthRequest, res: Response) => {
    try {
        const itemId = new mongoose.Types.ObjectId(req.params.itemId);
        const userId = req.user.sub;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.favoriteItems?.includes(itemId)) {
            return res.status(400).json({ message: "Item not in favorites" });
        }
        user.favoriteItems = user.favoriteItems.filter(id => !id.equals(itemId));
        await user.save();
        res.status(200).json({ message: "Item removed from favorites successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove favorite item" });
    }
}

export const getFavoriteItems = async (req: AUthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        const user = await User.findById(userId).populate('favoriteItems');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Favorite items fetched successfully",
            data: user.favoriteItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch favorite items" });
    }
}