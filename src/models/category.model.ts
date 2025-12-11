import mongoose, { Schema, Document } from "mongoose"

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

export enum VehicleSubCategory {
  CARS = "Cars",
  MOTORBIKES = "Motorbikes",
  THREE_WHEELERS = "Three Wheelers",
  BICYCLES = "Bicycles",
  VANS = "Vans",
  BUSES_LORRIES = "Buses & Lorries",
  VANS_BUSES_LORRIES_TRUCKS = "Vans, Buses, Lorries & Trucks",
  TRUCKS = "Trucks",
  HEAVY_MACHINERY_TRACTORS = "Heavy Machinery & Tractors",
  HEAVY_DUTY = "Heavy Duty",
  TRACTORS = "Tractors",
  AUTO_SERVICES = "Auto Services",
  RENTALS = "Rentals",
  AUTO_PARTS_ACCESSORIES = "Auto Parts & Accessories",
  MAINTENANCE_REPAIR = "Maintenance and Repair",
  BOATS_WATER_TRANSPORT = "Boats & Water Transport"
}

export enum PropertySubCategory {
  LAND = "Land",
  HOUSES_FOR_SALE = "Houses For Sale",
  HOUSE_RENTALS = "House Rentals",
  ROOM_ANNEX_RENTALS = "Room & Annex Rentals",
  HOUSES = "Houses",
  APARTMENTS = "Apartments",
  NEW_DEVELOPMENTS = "New Developments",
  COMMERCIAL_PROPERTY = "Commercial Property"
}

export enum ElectronicsSubCategory {
  MOBILE_PHONES = "Mobile Phones",
  MOBILE_PHONE_ACCESSORIES = "Mobile Phone Accessories",
  COMPUTERS_TABLETS = "Computers & Tablets",
  COMPUTER_ACCESSORIES = "Computer Accessories",
  TVS = "TVs",
  TV_VIDEO_ACCESSORIES = "TV & Video Accessories",
  CAMERAS_CAMCORDERS = "Cameras & Camcorders",
  AUDIO_MP3 = "Audio & MP3",
  ELECTRONIC_HOME_APPLIANCES = "Electronic Home Appliances",
  AIR_CONDITIONS_ELECTRICAL = "Air Conditions & Electrical fittings",
  VIDEO_GAMES_CONSOLES = "Video Games & Consoles",
  OTHER_ELECTRONICS = "Other Electronics"
}

export enum HomeGardenSubCategory {
  FURNITURE = "Furniture",
  HOME_APPLIANCES = "Home Appliances",
  BATHROOM_SANITARY = "Bathroom & Sanitary ware",
  BUILDING_MATERIAL_TOOLS = "Building Material & Tools",
  GARDEN = "Garden",
  HOME_DECOR = "Home Decor",
  KITCHEN_ITEMS = "Kitchen items",
  ELECTRICITY_AC_BATHROOM_GARDEN = "Electricity, AC, Bathroom & Garden",
  OTHER_HOME_ITEMS = "Other Home Items"
}

export enum FashionBeautySubCategory {
  BAGS_LUGGAGE = "Bags & Luggage",
  CLOTHING = "Clothing",
  SHOES_FOOTWEAR = "Shoes & Footwear",
  JEWELLERY = "Jewellery",
  SUNGLASSES_OPTICIANS = "Sunglasses & Opticians",
  WATCHES = "Watches",
  OTHER_FASHION_ACCESSORIES = "Other Fashion Accessories",
  BEAUTY_PRODUCTS = "Beauty Products"
}

export enum AnimalsSubCategory {
  PETS = "Pets",
  PET_FOOD = "Pet Food",
  VETERINARY_SERVICES = "Veterinary Services",
  FARM_ANIMALS = "Farm Animals",
  ANIMAL_ACCESSORIES = "Animal Accessories",
  OTHER_ANIMALS = "Other Animals"
}

export enum HobbySportKidsSubCategory {
  MUSICAL_INSTRUMENTS = "Musical Instruments",
  SPORTS_FITNESS = "Sports & Fitness",
  SPORTS_SUPPLEMENTS = "Sports Supplements",
  TRAVEL = "Travel",
  EVENTS_TICKETS = "Events & Tickets",
  ART_COLLECTIBLES = "Art & Collectibles",
  MUSIC_BOOKS_MOVIES = "Music, Books & Movies",
  CHILDRENS_ITEMS = "Children's Items",
  OTHER_HOBBY_SPORT_KIDS = "Other Hobby, Sport & Kids Items"
}

export enum BusinessIndustrySubCategory {
  SERVICE = "Service",
  SOLAR_GENERATORS = "Solar & Generators"
}

export enum EducationSubCategory {
  HIGHER_EDUCATION = "Higher Education",
  TEXTBOOKS = "Textbooks",
  TUITION = "Tuition",
  VOCATIONAL_INSTITUTES = "Vocational Institutes",
  OTHER_EDUCATION = "Other Education"
}

export enum AgricultureSubCategory {
  FOOD = "Food",
  CROPS = "Crops",
  SEEDS_PLANTS = "Seeds & Plants",
  OTHER_AGRICULTURE = "Other Agriculture"
}

export const allCategoriesWithSubCategories = {
  VEHICLES: Object.values(VehicleSubCategory),
  PROPERTY: Object.values(PropertySubCategory),
  ELECTRONICS: Object.values(ElectronicsSubCategory),
  HOME_GARDEN: Object.values(HomeGardenSubCategory),
  FASHION_BEAUTY: Object.values(FashionBeautySubCategory),
  ANIMALS: Object.values(AnimalsSubCategory),
  HOBBY_SPORT_KIDS: Object.values(HobbySportKidsSubCategory),
  BUSINESS_INDUSTRY: Object.values(BusinessIndustrySubCategory),
  EDUCATION: Object.values(EducationSubCategory),
  AGRICULTURE: Object.values(AgricultureSubCategory)
}

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  name: CategoryType
  subCategories: string[]
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      enum: Object.values(CategoryType),
      required: true,
      unique: true
    },
    subCategories: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0
        },
        message: "At least one subcategory is required"
      }
    },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

export const Category = mongoose.model<ICategory>("Category", categorySchema)