import express from 'express';
import cron from 'node-cron';

import syncFormResponses from './services/syncResponses.js';
import applicationsRoutes from './routes/applications.js';
import filesRoutes from './routes/files.js';

import config from './config.js';

const app = express();

app.use(express.json());

app.use('/api/applications', applicationsRoutes);
app.use('/api/files', filesRoutes);

await syncFormResponses();
cron.schedule('*/5 * * * *', () => {
  console.log('Running scheduled response sync...');
  syncFormResponses();
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
