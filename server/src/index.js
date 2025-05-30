import express from 'express'
import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { syncFormResponses } from './formSync.js'

const prisma = new PrismaClient()
const app = express()
const PORT = 3001

app.use(express.static('../client/dist'))
app.use(express.json())

// Set up cron job to sync form responses every minute (decrease in production)
cron.schedule('* * * * *', async () => {
  console.log('Running form response sync...')
  await syncFormResponses()
})

app.get('/api/messages', async (req, res) => {
  const messages = await prisma.testMessage.findMany()
  res.json(messages)
})

app.post('/api/messages', async (req, res) => {
  const { text } = req.body
  const message = await prisma.testMessage.create({ data: { text } })
  res.status(201).json(message)
})

app.get('/api/applicants', async (req, res) => { 
  const applicants = await prisma.applicant.findMany()
  res.json(applicants)
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  // Run initial sync when server starts
  syncFormResponses()
})