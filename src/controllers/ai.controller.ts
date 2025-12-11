import { Request, Response } from "express"
import { Item } from "../models/item.model"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { AUthRequest } from "../middleware/auth"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" })

// Generate embedding from text
async function embedText(text: string): Promise<number[]> {
  const embedding = await embedModel.embedContent(text)
  return embedding.embedding.values
}

// async function embedAllItems() {
//   const items = await Item.find()
//   for (const item of items) {
//     if (!item.embeddings || item.embeddings.length !== 768) {
//       const embedding = await embedText(`${item.itemName} ${item.itemDescription}`)
//       item.embeddings = embedding
//       await item.save()
//       console.log(`Updated embeddings for ${item.itemName}`)
//     }
//   }
// }
export const embedAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find()
    for (const item of items) {
      if (!item.embeddings || item.embeddings.length !== 768) {
        const embedding = await embedText(`${item.itemName} ${item.itemDescription}`)
        item.embeddings = embedding
        await item.save()
        console.log(`Updated embeddings for ${item.itemName}`)
      }
    }
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
export const aiSearch = async (req: AUthRequest, res: Response) => {
  try {
    const { query } = req.body
    if (!query) return res.status(400).json({ msg: "Missing query" })

    const queryEmbedding = await embedText(query)

    const results = await Item.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",   // <- required
          path: "embeddings",
          queryVector: queryEmbedding,
          numCandidates: 12,
          limit: 10
        }
      },
      {
        $project: {
          itemName: 1,
          itemPrice: 1,
          itemCategory: 1,
          itemSubCategory: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ])
    console.log("AI Search results:", results)
    res.json({ results })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
