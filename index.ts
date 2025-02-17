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
const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load environment variables
config({ path: `.env.development.local` });

// Set up server
const server = http.createServer(app);

// Database connection and seeders

// var db;
// do{
mongoose.set('bufferTimeoutMS', 30000); // Increase timeout to 30 seconds
// console.log(process.env.DB_URI);

databaseConnection(process.env.DB_URI);
loadSeeders();
// }while(db === undefined)

// Set server port
const PORT = process.env.PORT || 1000;

// Logger middleware
app.use(logger('dev'));

// CORS Configuration
const corsOptions = { origin: process.env.ALLOW_ORIGIN }; // Ensure this points to your frontend's URL (e.g., http://localhost:5173)
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

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN, // CORS for Socket.IO
    methods: ['GET', 'POST'],
  },
});

export { io };
io.on('connection', (socket) => {
  console.log('🚀 ~ io.on ~ socket:', 'socket connected');

  // Order tracking event
  socket.on(
    'orderTracking',
    async (deliveryManId: string, lat: number, long: number) => {
      if (!(long && lat)) {
        return socket.emit('orderTracking', {
          status: 400,
          message: 'Lat Long Required',
        });
      }

      const orderAssignData = await OrderAssigneeSchema.findOne({
        deliveryBoy: deliveryManId,
      });

      const orderData = await OrderSchema.findOne({
        orderId: orderAssignData.order,
        status: {
          $nin: [
            ORDER_HISTORY.CREATED,
            ORDER_HISTORY.ASSIGNED,
            ORDER_HISTORY.CANCELLED,
            ORDER_HISTORY.DELIVERED,
          ],
        },
      });

      if (orderData) {
        io.to(orderAssignData.order.toString()).emit('orderTracking', {
          lat,
          long,
        });

        await DeliveryManSchema.updateOne(
          { _id: deliveryManId },
          {
            $set: { 'location.coordinates': [long, lat] },
          },
        );
      }
    },
  );

  // Join a specific socket room (e.g., for order tracking)
  socket.on('socketJoin', (orderId: number) => {
    socket.join(orderId.toString());
  });

  // Leave a specific socket room
  socket.on('socketLeave', (orderId: number) => {
    socket.leave(orderId.toString());
  });

  // Send a message to a specific ticket
  socket.on('sendMessage', (ticketId, message) => {
    io.to(ticketId).emit('newMessage', message);
  });

  // Join ticket room
  socket.on('joinTicket', (ticketId) => {
    socket.join(ticketId);
  });

  socket.on('deleteMessage', (ticketId, messageId) => {
    // Emit the deletion to all clients in the ticket's room
    io.to(ticketId).emit('messageDeleted', { messageId });
  });

  // Socket disconnection
  socket.on('disconnect', () => {
    console.log('🚀 ~ socket.on ~ disconnect:', 'socket disconnected');
  });
});

// Start the server
server.listen(PORT, async () => {
  console.log(`Server Running At Port : ${PORT}`);
});
