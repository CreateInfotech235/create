"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
    merchantName: { type: String, required: true }, // Name of the merchant (user raising the issue)
});
const Model = mongoose.model('Ticket', TicketSchema);
exports.default = Model;
