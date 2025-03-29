import { Request, Response } from 'express';
import Image from "../../models/image.schema"; // Import the Image model
import sharp from "sharp";

const isValidBase64 = (base64Image: string): boolean => {
  return /^data:image\/(png|jpeg|jpg|webp|gif|bmp|tiff|svg|heif|ico|avif);base64,/.test(
    base64Image
  );
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { base64Image, prefixfilename, projectName = "Untitled", type } = req.body;

    if (prefixfilename) {
      const image = await Image.findOne({ imageName: prefixfilename });
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
    const mimeType = mimeMatch?.[1] || '';

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
      const extension = Object.entries(supportedTypes).find(
        ([_, mimes]) => mimes.includes(mimeType)
      )?.[0];
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
    const image = new Image({
      image: base64Image,
      imageName: imageName,
      imageUrl: newurl,
      projectName: projectName,
    });

    await image.save();
    res.status(200).json({ imageUrl: newurl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to upload image', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
export const getImage = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    console.log(filename, 'filename');
    const image = await Image.findOne({ imageName: filename });
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
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    
    // Supported MIME types mapping
    const mimeTypes: { [key: string]: string } = {
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
      const imgwidth = parseInt(req.query.width as string);
      
      if (imgwidth) {
        try {
          outputBuffer = await sharp(imgBuffer)
            .resize({ width: imgwidth })
            .toBuffer();
        } catch (error) {
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
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const updateImage = async (req: Request, res: Response) => {
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

    const image = await Image.findOne({ imageUrl: fileurl });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    image.image = base64Image;
    image.projectName = projectName || image.projectName || "Untitled";
    await image.save();
    res.status(200).json({ message: "Image updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { fileurl } = req.query;
    if (!fileurl) {
      return res.status(400).json({ message: "File URL is required" });
    }
    const image = await Image.findOne({ imageUrl: fileurl });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    await Image.deleteOne({ imageUrl: fileurl });
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
