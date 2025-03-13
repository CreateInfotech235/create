import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import logger from 'morgan';
import { Server } from 'socket.io';
import mobileSwaggerUI from 'swagger-ui-express';
import mongoose from 'mongoose';
import databaseConnection from './src/db/conn';
import swaggerDocs from './src/docs/SwaggerDocs';
import { ORDER_HISTORY } from './src/enum';
import DeliveryManSchema from './src/models/deliveryMan.schema';
import OrderSchema from './src/models/order.schema';
import OrderAssigneeSchema from './src/models/orderAssignee.schema';
import routes from './src/routes';
import loadSeeders from './src/seeders';
import responseHandler from './src/utils/responseHandler';
import WebNavbar from './src/models/webNavbar.schema';
import MerchantSchema from './src/models/user.schema';
const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load environment variables
config({ path: `.env.development.local` });

// Set up server
const server = http.createServer(app);

// Database connection and seeders
mongoose.set('bufferTimeoutMS', 30000); // Increase timeout to 30 seconds

databaseConnection(process.env.DB_URI);
loadSeeders();

// Set server port
const PORT = process.env.PORT || 1000;

// Logger middleware
app.use(logger('dev'));

// CORS Configuration
const corsOptions = {
  origin: (() => {
    const allowOrigin = process.env.ALLOW_ORIGIN || '[]';
    try {
      return JSON.parse(allowOrigin.replace(/^'|'$/g, ''));
    } catch (e) {
      console.error('Error parsing ALLOW_ORIGIN:', e);
      return [];
    }
  })(),
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

// Response handler middleware
app.use(responseHandler);

// Swagger Documentation (Optional)
const { ENV } = process.env;
if (ENV === 'DEV') {
  app.use(
    '/docs-for-api',
    mobileSwaggerUI.serve,
    mobileSwaggerUI.setup(swaggerDocs),
  );
}

// API routes
app.use(routes);

app.get('/favicon.ico', async function (req, res) {
  const menu = await WebNavbar.findOne({});

  const base64Image = menu?.favicon?.img; // Add full base64 string here

  const imgBuffer = Buffer.from(base64Image.split(',')[1], 'base64'); // Split and decode
  const arrayoftype = [
    'png',
    'webp',
    'jpg',
    'jpeg',
    'gif',
    'bmp',
    'tiff',
    'svg',
    'heif',
    'ico',
    'avif',
  ];

  const imageType = arrayoftype.find((type) => base64Image.includes(type));
  res.writeHead(200, {
    'Content-Type': `image/${imageType}`,
    'Content-Length': imgBuffer.length,
  });
  res.end(imgBuffer);
});

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Authentication middleware for socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Verify token here if needed
  next();
});

// Handle socket connections
io.on('connection', (socket) => {
  // Join user to their own room using userId
  socket.on('userdata', async (data) => {
    socket.join(data.userId.toString());
    console.log('User connected:', data);
  });

  socket.emit('welcome', { message: 'server is connected' });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Socket disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Export io instance for use in other files
export { io };

// Start the server
server.listen(PORT, async () => {
  console.log(`Server Running At Port : ${PORT}`);
});
