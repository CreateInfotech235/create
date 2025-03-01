import mongoose from 'mongoose';

const WebFooterSchema = new mongoose.Schema(
    {
        logo: {
            type: String,
        },

        
        
        copyright: {
            type: String,
        },
    }
);

export default mongoose.model('WebFooter', WebFooterSchema);
