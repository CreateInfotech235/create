import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  socialMediaPlatform:[
    {
      defaultImage: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model('SocialMedia', SocialMediaSchema);
