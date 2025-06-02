import express from 'express'
import cron from 'node-cron'

import { getFormsClient } from './services/formsService.js'
import { syncFormResponses } from './services/syncService.js'
import applicationsRoutes from './routes/applications.js'
import filesRoutes from './routes/files.js'

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.static('../client/dist'))

// Routes
app.use('/api/applications', applicationsRoutes)
app.use('/api/files', filesRoutes)

// Initialize Forms client and start sync
let formsClient;
getFormsClient().then(client => {
  formsClient = client;
  
  syncFormResponses(formsClient);
  
  // Schedule sync every minute
  cron.schedule('*/5 * * * *', () => {
    console.log('Running scheduled response sync...');
    syncFormResponses(formsClient);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})