import express from 'express';

import { router as apiRoutes } from './routes/api-routes';

export const app = express();

app.get('/api', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API is live on port ${port}`));
