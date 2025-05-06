import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const PORT = 3001

app.use(express.static('../client/dist'))
app.use(express.json())

app.get('/api/messages', async (req, res) => {
  const messages = await prisma.testMessage.findMany()
  res.json(messages)
})

app.post('/api/messages', async (req, res) => {
  const { text } = req.body
  const message = await prisma.testMessage.create({ data: { text } })
  res.status(201).json(message)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})