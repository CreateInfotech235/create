"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getimgurl = void 0;
const getimgurl = (value) => {
    const currentTime = Date.now();
    const base64Image = value; // Assuming userSignature is a base64 image
    const prefixFilename = `${currentTime}`;
    fetch(process.env.IMAGE_STORAGE_UPLOAD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64Image: base64Image,
            prefixfilename: prefixFilename,
            projectName: process.env.PROJECT_NAME,
        }),
    });
    // data:image/jpeg;base64,
    const arrayoftype = [
        'png',
        'webp',
        'jpg',
        'jpeg',
        'gif',
        'bmp',
        'tiff',
        'svg',
        'heif',
        'ico',
        'avif',
    ];
    const imageType = arrayoftype.find((type) => base64Image.includes(type));
    const imgurl = `${process.env.IMAGE_STORAGE_GET_IMAGE_URL}/${prefixFilename}.${imageType}`;
    return imgurl;
};
exports.getimgurl = getimgurl;
