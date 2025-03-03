import mongoose from 'mongoose';
// bile of delivery boy payment
const HomeLandingpageSchema = new mongoose.Schema(
  {
    AutoTyperlist: [{type: String}],
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    bgImage: {
        type: String,
    }    
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('homeLandingpage', HomeLandingpageSchema, 'homeLandingpage');

export default Model;
