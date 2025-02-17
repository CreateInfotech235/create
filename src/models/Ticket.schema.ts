const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  merchantName: { type: String, required: true }, // Name of the merchant (user raising the issue)
  
});

const Model = mongoose.model('Ticket', TicketSchema);

export default Model;
