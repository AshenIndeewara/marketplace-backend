import mongoose, { Schema, Document } from "mongoose"

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - sellerId
 *         - itemName
 *         - itemPrice
 *         - itemDescription
 *         - itemImages
 *         - itemCategory
 *         - itemSubCategory
 *       properties:
 *         _id:
 *           type: string
 *         sellerId:
 *           type: string
 *         itemName:
 *           type: string
 *         itemPrice:
 *           type: number
 *         itemDescription:
 *           type: string
 *         itemImages:
 *           type: array
 *           items:
 *             type: string
 *         itemCategory:
 *           type: string
 *           enum:
 *             - Vehicles
 *             - Property
 *             - Electronics
 *             - Home & Garden
 *             - Fashion & Beauty
 *             - Animals
 *             - Hobby, Sport & Kids
 *             - Business & Industry
 *             - Education
 *             - Agriculture
 *         itemSubCategory:
 *           type: string
 *         location:
 *           type: string
 *         condition:
 *           type: string
 *           enum:
 *             - New
 *             - Like New
 *             - Used - Good
 *             - Used - Fair
 *             - For Parts
 *         isApproved:
 *           type: boolean
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *             - SOLD
 *         views:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export enum CategoryType {
  VEHICLES = "Vehicles",
  PROPERTY = "Property",
  ELECTRONICS = "Electronics",
  HOME_GARDEN = "Home & Garden",
  FASHION_BEAUTY = "Fashion & Beauty",
  ANIMALS = "Animals",
  HOBBY_SPORT_KIDS = "Hobby, Sport & Kids",
  BUSINESS_INDUSTRY = "Business & Industry",
  EDUCATION = "Education",
  AGRICULTURE = "Agriculture"
}

export enum ItemStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SOLD = "SOLD"
}

export interface IItem extends Document {
  _id: mongoose.Types.ObjectId
  sellerId: mongoose.Types.ObjectId
  itemName: string
  itemPrice: number
  itemDescription: string
  itemImages: string[]
  itemCategory: CategoryType
  itemSubCategory: string
  location?: string
  condition?: string
  isApproved: boolean
  status: ItemStatus
  views: number
  createdAt: Date
  updatedAt: Date
}

const itemSchema = new Schema<IItem>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemName: { type: String, required: true, trim: true },
    itemPrice: { type: Number, required: true, min: 0 },
    itemDescription: { type: String, required: true },
    itemImages: { 
      type: [String], 
      required: true,
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0 && arr.length <= 10
        },
        message: "Must have between 1 and 10 images"
      }
    },
    itemCategory: { 
      type: String, 
      enum: Object.values(CategoryType), 
      required: true 
    },
    itemSubCategory: { type: String, required: true },
    location: { type: String },
    condition: { 
      type: String, 
      enum: ["New", "Like New", "Used - Good", "Used - Fair", "For Parts"]
    },
    isApproved: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: Object.values(ItemStatus), 
      default: ItemStatus.PENDING 
    },
    views: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

itemSchema.index({ sellerId: 1, createdAt: -1 })
itemSchema.index({ itemCategory: 1, itemSubCategory: 1 })
itemSchema.index({ status: 1, isApproved: 1 })
itemSchema.index({ itemName: "text", itemDescription: "text" })

export const Item = mongoose.model<IItem>("Item", itemSchema)