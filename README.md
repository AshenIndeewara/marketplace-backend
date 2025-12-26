# Ikman LK - Online Marketplace Platform

A modern, full-featured online marketplace platform similar to OLX/Ikman.lk, built with Node.js, Express, TypeScript, and MongoDB. This platform enables users to buy and sell items across multiple categories with advanced features like AI-powered search, admin moderation, and role-based access control.

## 🌟 Features

### User Features
- **User Authentication & Authorization**
  - Secure registration and login with JWT tokens
  - Role-based access control (Super Admin, Admin, Seller)
  - Password encryption using bcrypt

- **Item Management**
  - Create, edit, and delete item listings
  - Upload multiple images (up to 10) per item using Cloudinary
  - Support for 10 major categories with subcategories
  - Item status tracking (Pending, Approved, Rejected, Sold)
  - Mark items as sold
  - View count tracking

- **Advanced Search & Discovery**
  - AI-powered semantic search using Google Gemini
  - Text-based search with MongoDB text indexes
  - Category and subcategory filtering
  - Vector embeddings for intelligent item recommendations

- **Favorites System**
  - Add/remove items to favorites
  - View all favorite items

### Admin Features
- **Item Moderation**
  - Approve or reject pending item listings
  - View all items with filtering options
  - Monitor platform activity

- **User Management**
  - View all registered users
  - Promote users to admin role (Super Admin only)
  - Demote admins to regular users (Super Admin only)

- **Auto Super Admin Creation**
  - Automatically creates a super admin account on first startup

## 🛠️ Technologies & Tools

### Backend
- **Runtime & Framework**
  - Node.js
  - Express.js 5.x
  - TypeScript 5.x

- **Database**
  - MongoDB with Mongoose ODM
  - Vector search capabilities for AI features

- **Authentication & Security**
  - JSON Web Tokens (JWT)
  - bcryptjs for password hashing
  - CORS enabled for cross-origin requests

- **File Upload & Storage**
  - Multer for file handling
  - Cloudinary for image storage and CDN

- **AI & Machine Learning**
  - Google Generative AI (Gemini)
  - Vector embeddings for semantic search

- **Development Tools**
  - ts-node-dev for hot reloading
  - TypeScript for type safety

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Cloudinary account
- Google Gemini API key

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd IJSE-SITE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp example.env .env
```

Update the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/ikman
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ikman

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Super Admin Credentials
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=SuperAdmin123!
```

### 4. Run the Application

#### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with hot reloading enabled.

#### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
IJSE-SITE/
├── src/
│   ├── config/           # Configuration files
│   │   └── cloudinary.ts # Cloudinary setup
│   ├── controllers/      # Request handlers
│   │   ├── admin.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── item.controller.ts
│   │   └── seller.controller.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── role.ts       # Role-based authorization
│   │   └── upload.ts     # File upload handling
│   ├── models/           # Database models
│   │   ├── category.model.ts
│   │   ├── item.model.ts
│   │   └── user.model.ts
│   ├── routes/           # API routes
│   │   ├── admin.ts
│   │   ├── ai.ts
│   │   ├── auth.ts
│   │   ├── item.ts
│   │   └── seller.ts
│   ├── utils/            # Utility functions
│   │   ├── superAdmin.ts # Super admin creation
│   │   └── tokens.ts     # JWT token utilities
│   └── index.ts          # Application entry point
├── .env                  # Environment variables (not in repo)
├── example.env           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |

### Items (`/api/v1/item`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/add` | Create new item listing | Authenticated (Seller/Admin) |
| GET | `/all` | Get all approved items | Public |
| GET | `/:id` | Get item by ID | Authenticated |
| PUT | `/update/:id` | Update item | Authenticated (Owner/Admin) |
| DELETE | `/delete/:id` | Delete item | Authenticated (Owner/Admin) |
| GET | `/categories` | Get all categories | Public |
| GET | `/` | Search items | Public |
| GET | `/:category/:subCategory` | Get items by category | Public |
| PUT | `/approve/:id` | Approve item | Admin only |
| PUT | `/reject/:id` | Reject item | Admin only |
| PUT | `/sold/:id` | Mark item as sold | Authenticated (Owner/Admin) |

### Seller (`/api/v1/seller`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/my-items` | Get seller's items | Seller |
| POST | `/favorite-item/:itemId` | Add item to favorites | Seller |
| DELETE | `/favorite-item/:itemId` | Remove from favorites | Seller |
| GET | `/favorite-items` | Get all favorites | Seller |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items` | Get all items (including pending) | Admin |
| GET | `/users` | Get all users | Admin |
| PUT | `/make-admin/:id` | Promote user to admin | Super Admin |
| PUT | `/remove-admin/:id` | Demote admin to user | Super Admin |

### AI Search (`/api/v1/ask`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/search` | AI-powered semantic search | Public |
| GET | `/generate-item-embedding` | Generate embeddings for all items | Authenticated |

## 📦 Data Models

### User Model
```typescript
{
  email: string (unique)
  firstname: string
  lastname: string
  password: string (hashed)
  phone: string
  address?: string
  roles: Role[] (SUPER_ADMIN | ADMIN | SELLER)
  favoriteItems?: ObjectId[]
}
```

### Item Model
```typescript
{
  sellerId: ObjectId (ref: User)
  itemName: string
  itemPrice: number
  itemDescription: string
  itemImages: string[] (1-10 images)
  itemCategory: CategoryType
  itemSubCategory: string
  location?: string
  condition?: string (New | Like New | Used - Good | Used - Fair | For Parts)
  isApproved: boolean
  status: ItemStatus (PENDING | APPROVED | REJECTED | SOLD)
  views: number
  embeddings?: number[] (for AI search)
  createdAt: Date
  updatedAt: Date
}
```

### Categories
- Vehicles
- Property
- Electronics
- Home & Garden
- Fashion & Beauty
- Animals
- Hobby, Sport & Kids
- Business & Industry
- Education
- Agriculture

## 🌐 Deployment

### Backend Deployment

The backend can be deployed to various platforms:

#### Option 1: Railway
1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables from `.env`
4. Deploy automatically

#### Option 2: Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

#### Option 3: Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
# Add all environment variables
git push heroku main
```

### Frontend Deployment

The frontend (if separate) can be deployed to:
- **Vercel** - Recommended for Next.js/React apps
- **Netlify** - Great for static sites
- **GitHub Pages** - For simple static sites

### Database Deployment

For production, use **MongoDB Atlas**:
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your application's IP (or use 0.0.0.0/0 for all)
4. Get the connection string and update `MONGO_URI` in `.env`

## 🔗 Deployed URLs

> **Note:** Update these URLs with your actual deployment links

- **Frontend:** `https://marketplace-vert-nine.vercel.app`
- **Backend API:** `https://marketplace-backend-eta-nine.vercel.app`

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Login and receive JWT token
3. Create an item listing with images
4. Test search functionality
5. Test admin approval workflow
6. Test favorites system

### API Testing with Postman/Thunder Client
Import the following base URL and test all endpoints:
```
Base URL: http://localhost:5000/api/v1
```

Example requests:

**Register:**
```json
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Create Item:**
```json
POST /api/v1/item/add
Headers: { "Authorization": "Bearer <token>" }
Form Data:
- itemName: "iPhone 14 Pro"
- itemPrice: 999
- itemDescription: "Brand new iPhone 14 Pro"
- itemCategory: "Electronics"
- itemSubCategory: "Mobile Phones"
- location: "Colombo"
- condition: "New"
- images: [file1, file2, ...]
```

## 🔐 Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Role-Based Access Control:** Different permissions for users, admins, and super admins
- **CORS Protection:** Configured for specific origins
- **Input Validation:** Mongoose schema validation
- **File Upload Security:** File type and size restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Ashen indeewara** - Initial work

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database
- Cloudinary for image hosting
- Google Gemini for AI capabilities
- The open-source community

## 📞 Support

For support, create an issue in the repository.

---

**Made with ❤️ for IJSE**
