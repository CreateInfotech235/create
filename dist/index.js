"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoose_1 = __importDefault(require("mongoose"));
const conn_1 = __importDefault(require("./src/db/conn"));
const SwaggerDocs_1 = __importDefault(require("./src/docs/SwaggerDocs"));
const enum_1 = require("./src/enum");
const deliveryMan_schema_1 = __importDefault(require("./src/models/deliveryMan.schema"));
const order_schema_1 = __importDefault(require("./src/models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("./src/models/orderAssignee.schema"));
const routes_1 = __importDefault(require("./src/routes"));
const seeders_1 = __importDefault(require("./src/seeders"));
const responseHandler_1 = __importDefault(require("./src/utils/responseHandler"));
const webNavbar_schema_1 = __importDefault(require("./src/models/webNavbar.schema"));
const path = require('path');
const app = (0, express_1.default)();
app.use('/uploads', express_1.default.static(path.join(__dirname, 'uploads')));
// Load environment variables
(0, dotenv_1.config)({ path: `.env.development.local` });
// Set up server
const server = http_1.default.createServer(app);
// Database connection and seeders
// var db;
// do{
mongoose_1.default.set('bufferTimeoutMS', 30000); // Increase timeout to 30 seconds
// console.log(process.env.DB_URI);
(0, conn_1.default)(process.env.DB_URI);
(0, seeders_1.default)();
// }while(db === undefined)
// Set server port
const PORT = process.env.PORT || 1000;
// Logger middleware
app.use((0, morgan_1.default)('dev'));
// CORS Configuration
const corsOptions = { origin: process.env.ALLOW_ORIGIN }; // Ensure this points to your frontend's URL (e.g., http://localhost:5173)
app.use((0, cors_1.default)(corsOptions));
// Body parser middleware
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
}));
// Response handler middleware
app.use(responseHandler_1.default);
// Swagger Documentation (Optional)
const { ENV } = process.env;
if (ENV === 'DEV') {
    app.use('/docs-for-api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(SwaggerDocs_1.default));
}
// API routes
app.use(routes_1.default);
app.get('/favicon.ico', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const menu = yield webNavbar_schema_1.default.findOne({});
        const base64Image = (_a = menu === null || menu === void 0 ? void 0 : menu.favicon) === null || _a === void 0 ? void 0 : _a.img; // Add full base64 string here
        console.log('base64Image', base64Image);
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
});
// Socket.IO Setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.ALLOW_ORIGIN, // CORS for Socket.IO
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
io.on('connection', (socket) => {
    console.log('🚀 ~ io.on ~ socket:', 'socket connected');
    // Order tracking event
    socket.on('orderTracking', (deliveryManId, lat, long) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(long && lat)) {
            return socket.emit('orderTracking', {
                status: 400,
                message: 'Lat Long Required',
            });
        }
        const orderAssignData = yield orderAssignee_schema_1.default.findOne({
            deliveryBoy: deliveryManId,
        });
        const orderData = yield order_schema_1.default.findOne({
            orderId: orderAssignData.order,
            status: {
                $nin: [
                    enum_1.ORDER_HISTORY.CREATED,
                    enum_1.ORDER_HISTORY.ASSIGNED,
                    enum_1.ORDER_HISTORY.CANCELLED,
                    enum_1.ORDER_HISTORY.DELIVERED,
                ],
            },
        });
        if (orderData) {
            io.to(orderAssignData.order.toString()).emit('orderTracking', {
                lat,
                long,
            });
            yield deliveryMan_schema_1.default.updateOne({ _id: deliveryManId }, {
                $set: { 'location.coordinates': [long, lat] },
            });
        }
    }));
    // Join a specific socket room (e.g., for order tracking)
    socket.on('socketJoin', (orderId) => {
        socket.join(orderId.toString());
    });
    // Leave a specific socket room
    socket.on('socketLeave', (orderId) => {
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
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server Running At Port : ${PORT}`);
}));
