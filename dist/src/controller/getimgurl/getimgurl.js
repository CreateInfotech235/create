"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getimgurl = void 0;
const getimgurl = (value, type) => {
    var _a;
    const currentTime = Date.now();
    const base64Image = value;
    const prefixFilename = `${currentTime}`;
    // Define supported file types with their MIME types as arrays
    const supportedTypes = {
        png: ['image/png'],
        webp: ['image/webp'],
        jpg: ['image/jpeg'],
        jpeg: ['image/jpeg'],
        gif: ['image/gif'],
        bmp: ['image/bmp'],
        tiff: ['image/tiff'],
        svg: ['image/svg+xml'],
        heif: ['image/heif'],
        ico: ['image/x-icon'],
        avif: ['image/avif'],
        pdf: ['application/pdf'],
        doc: ['application/msword'],
        docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        zip: ['application/zip', 'application/x-zip-compressed', 'x-zip-compressed'],
        rar: ['application/x-rar-compressed'],
        txt: ['text/plain'],
        csv: ['text/csv'],
        json: ['application/json'],
        xml: ['application/xml'],
    };
    // If type is provided, use it directly
    let fileType = type;
    // If no type provided, try to detect from base64 string
    if (!fileType) {
        // Extract the MIME type from base64 string if present
        const mimeMatch = base64Image.match(/^data:([^;]+);/);
        if (mimeMatch) {
            const mimeType = mimeMatch[1];
            // Find matching extension from supported types
            const extension = (_a = Object.entries(supportedTypes).find(([_, mimes]) => mimes.includes(mimeType))) === null || _a === void 0 ? void 0 : _a[0];
            if (extension) {
                fileType = extension;
            }
        }
    }
    console.log(fileType, 'fileType');
    // If still no type, default to 'png'
    if (!fileType) {
        fileType = 'png';
    }
    // Ensure the file type is supported
    if (!Object.keys(supportedTypes).includes(fileType)) {
        fileType = 'png'; // Default to png if unsupported type
    }
    fetch(process.env.IMAGE_STORAGE_UPLOAD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64Image: base64Image,
            prefixfilename: prefixFilename,
            projectName: process.env.PROJECT_NAME,
            type: fileType,
        }),
    });
    const imgurl = `${process.env.IMAGE_STORAGE_GET_IMAGE_URL}/${prefixFilename}.${fileType}`;
    return imgurl;
};
exports.getimgurl = getimgurl;
