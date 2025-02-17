import mongoose from 'mongoose';

const WebFooterSchema = new mongoose.Schema(
    {
        logo: {
            type: String,
        },
        description: {
            type: String,
        },
        gellary: [{
            type: String,
        }],
        socialMedia: [{
            type: String,
        }],
        extraLinks: [{
            title: {
                type: String,
            },
            subLink: [
                {
                    title: {
                        type: String,
                    },
                    link: {
                        type: String,
                    }
                }
            ],
        }],
        copyright: {
            type: String,
        },
    }
);

export default mongoose.model('WebFooter', WebFooterSchema);
