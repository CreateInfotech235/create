import mongoose from 'mongoose';

const WebNavbarSchema = new mongoose.Schema({
  logo: {
    img: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  menuList: [
    {
      name: {
        type: String,
      },
      path: {
        type: String,
      },
    },
  ],
  favicon: {
    img: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  button: {
    name: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  defaultProfileImage: {
    type: String,
  },
});

export default mongoose.model('WebNavbar', WebNavbarSchema);
