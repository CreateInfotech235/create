import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import logger from 'morgan';
import { Server } from 'socket.io';
import mobileSwaggerUI from 'swagger-ui-express';
import databaseConnection from './src/db/conn';
import swaggerDocs from './src/docs/SwaggerDocs';
import { ORDER_HISTORY } from './src/enum';
import DeliveryManSchema from './src/models/deliveryMan.schema';
import OrderSchema from './src/models/order.schema';
import OrderAssigneeSchema from './src/models/orderAssignee.schema';
import routes from './src/routes';
import loadSeeders from './src/seeders';
import responseHandler from './src/utils/responseHandler';

const app = express();

// config({ path: `.env.development.${process.env.NODE_ENV}`, debug: false });
config({ path: `.env.development.local` });

const server = http.createServer(app);

databaseConnection(process.env.DB_URI);
loadSeeders();

const PORT = process.env.PORT || 1000;

app.use(logger('dev'));

const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(responseHandler);

// const { startCrone } = require('./src/utils/taskSchedule')
// const { startSocketServer } = require('./src/controller/socketController')

app.use(routes);

const { ENV } = process.env;

if (ENV === 'DEV') {
  app.use(
    '/docs-for-api',
    mobileSwaggerUI.serve,
    mobileSwaggerUI.setup(swaggerDocs),
  );
}

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('🚀 ~ io.on ~ socket:', 'socket connected');

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

  socket.on('socketJoin', (orderId: number) => {
    socket.join(orderId.toString());
  });

  socket.on('socketLeave', (orderId: number) => {
    socket.leave(orderId.toString());
  });

  socket.on('disconnect', () => {
    console.log('🚀 ~ socket.on ~ disconnect:', 'socket disconnected');
  });
});

server.listen(PORT, async () => {
  console.log(`Server Running At Port : ${PORT}`);
});
