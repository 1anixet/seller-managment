import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import config from './config';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import salesRoutes from './routes/sales';
import stockRoutes from './routes/stock';

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stock', stockRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Server is running successfully   ║
  ╠════════════════════════════════════════╣
  ║   Environment: ${config.env.padEnd(23)} ║
  ║   Port: ${PORT.toString().padEnd(30)} ║
  ║   URL: http://localhost:${PORT.toString().padEnd(15)} ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;
