import mongoose from 'mongoose';

const Part1Schema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    bgImage: {
        type: String,
    },
});


const Part2Schema = new mongoose.Schema({
    title: {
        type: String,
    },
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    subImage: {
        type: String,
    },  
});


const WebPricingSchema = new mongoose.Schema(
    {
        Part1: [Part1Schema],
        Part2: [Part2Schema],
    },
);

export default mongoose.model('WebPricing', WebPricingSchema);
