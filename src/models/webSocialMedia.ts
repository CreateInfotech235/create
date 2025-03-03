import mongoose from 'mongoose';
// bile of delivery boy payment
const WebSocialMediaSchema = new mongoose.Schema(
  {
    email: { type: String },
    phoneNumber: { type: String },
    socialMedia: [
        {
            name: { type: String },
            link: { type: String },
            icon: { type: String },
        }
    ],
  },
  { timestamps: true, versionKey: false },
);

const Model = mongoose.model('webSocialMedia', WebSocialMediaSchema, 'webSocialMedia');

export default Model;
