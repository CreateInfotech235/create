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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const conn_1 = __importDefault(require("./src/db/conn"));
const SwaggerDocs_1 = __importDefault(require("./src/docs/SwaggerDocs"));
const enum_1 = require("./src/enum");
const deliveryMan_schema_1 = __importDefault(require("./src/models/deliveryMan.schema"));
const order_schema_1 = __importDefault(require("./src/models/order.schema"));
const orderAssignee_schema_1 = __importDefault(require("./src/models/orderAssignee.schema"));
const routes_1 = __importDefault(require("./src/routes"));
const seeders_1 = __importDefault(require("./src/seeders"));
const responseHandler_1 = __importDefault(require("./src/utils/responseHandler"));
const app = (0, express_1.default)();
// config({ path: `.env.development.${process.env.NODE_ENV}`, debug: false });
(0, dotenv_1.config)({ path: `.env.development.local` });
const server = http_1.default.createServer(app);
(0, conn_1.default)(process.env.DB_URI);
(0, seeders_1.default)();
const PORT = process.env.PORT || 1000;
app.use((0, morgan_1.default)('dev'));
const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
}));
app.use(responseHandler_1.default);
// const { startCrone } = require('./src/utils/taskSchedule')
// const { startSocketServer } = require('./src/controller/socketController')
app.use(routes_1.default);
const { ENV } = process.env;
if (ENV === 'DEV') {
    app.use('/docs-for-api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(SwaggerDocs_1.default));
}
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('🚀 ~ io.on ~ socket:', 'socket connected');
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
    socket.on('socketJoin', (orderId) => {
        socket.join(orderId.toString());
    });
    socket.on('socketLeave', (orderId) => {
        socket.leave(orderId.toString());
    });
    socket.on('disconnect', () => {
        console.log('🚀 ~ socket.on ~ disconnect:', 'socket disconnected');
    });
});
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server Running At Port : ${PORT}`);
}));
