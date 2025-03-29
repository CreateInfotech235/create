"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.updateImage = exports.getImage = exports.uploadImage = void 0;
const image_schema_1 = __importDefault(require("../../models/image.schema")); // Import the Image model
const sharp_1 = __importDefault(require("sharp"));
const isValidBase64 = (base64Image) => {
    return /^data:image\/(png|jpeg|jpg|webp|gif|bmp|tiff|svg|heif|ico|avif);base64,/.test(base64Image);
};
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { base64Image, prefixfilename, projectName = "Untitled", type } = req.body;
        if (prefixfilename) {
            const image = yield image_schema_1.default.findOne({ imageName: prefixfilename });
            if (image) {
                return res
                    .status(400)
                    .json({ message: "Prefix filename already exists" });
            }
        }
        if (!base64Image) {
            return res.status(400).json({ message: "Base64 image is required" });
        }
        // Extract MIME type from base64 string if present
        const mimeMatch = base64Image.match(/^data:([^;]+);/);
        const mimeType = (mimeMatch === null || mimeMatch === void 0 ? void 0 : mimeMatch[1]) || '';
        // Define supported file types with their MIME types
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
            zip: ['application/zip', 'application/x-zip-compressed', 'x-zip-compressed'],
            doc: ['application/msword'],
            docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        };
        // Determine file type
        let fileType = type;
        console.log(fileType);
        console.log(type);
        if (!fileType && mimeType) {
            // Find matching extension from supported types
            const extension = (_a = Object.entries(supportedTypes).find(([_, mimes]) => mimes.includes(mimeType))) === null || _a === void 0 ? void 0 : _a[0];
            if (extension) {
                fileType = extension;
            }
        }
        // If still no type, default to 'png'
        if (!fileType) {
            fileType = 'png';
        }
        // Ensure the file type is supported
        if (!Object.keys(supportedTypes).includes(fileType)) {
            return res.status(400).json({
                message: `Unsupported file type. Supported types are: ${Object.keys(supportedTypes).join(', ')}`
            });
        }
        const imgBuffer = Buffer.from(base64Image.split(",")[1], "base64");
        const imageName = prefixfilename
            ? prefixfilename + `.${fileType}`
            : Date.now() + `.${fileType}`;
        const sizeInBytes = imgBuffer.length;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        console.log(`Size: ${sizeInMB} MB, ${sizeInKB} KB`);
        console.log(imageName);
        console.log(fileType);
        const newurl = `${req.protocol}://${req.headers.host}/images/getImage/${imageName}`;
        const image = new image_schema_1.default({
            image: base64Image,
            imageName: imageName,
            imageUrl: newurl,
            projectName: projectName,
        });
        yield image.save();
        res.status(200).json({ imageUrl: newurl });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload image', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.uploadImage = uploadImage;
const getImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const filename = req.params.filename;
        console.log(filename, 'filename');
        const image = yield image_schema_1.default.findOne({ imageName: filename });
        console.log(image, 'image');
        if (!image) {
            return res.status(404).json({ message: "Not found" });
        }
        const base64Image = image.image;
        if (!base64Image) {
            return res.status(400).json({ message: "data not found" });
        }
        // if (!isValidBase64(base64Image)) {
        //   return res.status(400).json({ message: "Invalid image data" });
        // }
        // Extract file extension from filename
        const fileExtension = (_b = filename.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        // Supported MIME types mapping
        const mimeTypes = {
            png: 'image/png',
            webp: 'image/webp',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            bmp: 'image/bmp',
            tiff: 'image/tiff',
            svg: 'image/svg+xml',
            heif: 'image/heif',
            ico: 'image/x-icon',
            avif: 'image/avif',
            pdf: 'application/pdf',
            zip: 'application/zip',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        const contentType = mimeTypes[fileExtension || ''] || 'application/octet-stream';
        const imgBuffer = Buffer.from(base64Image.split(",")[1], "base64");
        if (!imgBuffer || imgBuffer.length === 0) {
            return res.status(400).json({ message: "Image buffer is empty" });
        }
        // If it's an image, process it with sharp
        if (contentType.startsWith('image/')) {
            let outputBuffer = imgBuffer;
            const imgwidth = parseInt(req.query.width);
            if (imgwidth) {
                try {
                    outputBuffer = yield (0, sharp_1.default)(imgBuffer)
                        .resize({ width: imgwidth })
                        .toBuffer();
                }
                catch (error) {
                    console.error('Error processing image with sharp:', error);
                    outputBuffer = imgBuffer;
                }
            }
            res.writeHead(200, {
                "Content-Type": contentType,
                "Content-Length": outputBuffer.length,
            });
            return res.end(outputBuffer);
        }
        // For non-image files, send as download
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(imgBuffer);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
exports.getImage = getImage;
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { base64Image, projectName } = req.body;
        const { fileurl } = req.query;
        if (!fileurl) {
            return res.status(400).json({ message: "File URL is required" });
        }
        if (!base64Image) {
            return res.status(400).json({ message: "Base64 image is required" });
        }
        if (!isValidBase64(base64Image)) {
            return res.status(400).json({ message: "Invalid base64 image" });
        }
        const image = yield image_schema_1.default.findOne({ imageUrl: fileurl });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        image.image = base64Image;
        image.projectName = projectName || image.projectName || "Untitled";
        yield image.save();
        res.status(200).json({ message: "Image updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.updateImage = updateImage;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileurl } = req.query;
        if (!fileurl) {
            return res.status(400).json({ message: "File URL is required" });
        }
        const image = yield image_schema_1.default.findOne({ imageUrl: fileurl });
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        yield image_schema_1.default.deleteOne({ imageUrl: fileurl });
        res.status(200).json({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
exports.deleteImage = deleteImage;
