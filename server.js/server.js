// server.js
import express from "express"
import cors from "cors"
import { config } from "dotenv"
import OpenAI from "openai"

config()
const app = express()
const port = process.env.PORT || 3000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.use(cors())
app.use(express.json())

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    })

    res.json(completion.choices)
  } catch (error) {
    console.error("🔥 Error from OpenAI:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/", (req, res) => {
  res.send("✅ GPT Webhook 서버가 정상 작동 중입니다!")
})

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
