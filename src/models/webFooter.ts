import mongoose from 'mongoose';
import { CONTACT_US_TYPE } from '../enum';

const WebFooterSchema = new mongoose.Schema({
  Resources: [
    {
      name: String,
      link: String,
    },
  ],
  ContactUs:
  [
    {
      data: String,
      type: {
        type: String,
        enum: CONTACT_US_TYPE,
      },
      link: String
    }
  ],    
  copyright: {
    text: String,
    link: String
  },
});

export default mongoose.model('WebFooter', WebFooterSchema);
