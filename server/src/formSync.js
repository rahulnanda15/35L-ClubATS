import { PrismaClient } from '@prisma/client'
import { listResponses } from './formsClient.js'

const prisma = new PrismaClient()

export async function syncFormResponses() {
  try {
    const responses = await listResponses()
    
    // Get existing response IDs directly
    const existingResponseIds = new Set(
      (await prisma.applicant.findMany({
        select: { responseID: true }
      })).map(r => r.responseID)
    )
    
    // Filter out responses that are already in the database
    const newResponses = responses.filter(response => !existingResponseIds.has(response.responseId))
    
    for (const response of newResponses) {
      const email = response.respondentEmail;
      
      await prisma.applicant.create({
        data: {
          email,
          responseID: response.responseId,
          submittedAt: response.createTime,
          responses: response.answers,
        }
      })
      
      console.log(`Stored new response for ${email}`)
    }
    
    console.log(`Synced ${newResponses.length} new form responses`)
  } catch (error) {
    console.error('Error syncing form responses:', error)
  }
} 