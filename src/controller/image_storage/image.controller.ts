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
    const { base64Image, prefixfilename, projectName = "Untitled" } = req.body;

    if (prefixfilename) {
      const image = await Image.findOne({ imageName: prefixfilename });
      if (image) {
        return res
          .status(400)
          .json({ message: "Prefix filename is already exist" });
      }
    }

    if (!base64Image) {
      return res.status(400).json({ message: "Base64 image is required" });
    }
    if (!isValidBase64(base64Image)) {
      return res.status(400).json({ message: "Invalid base64 image" });
    }
    const arrayoftype = [
      "png",
      "webp",
      "jpg",
      "jpeg",
      "gif",
      "bmp",
      "tiff",
      "svg",
      "heif",
      "ico",
      "avif",
    ];

    const imageType = arrayoftype.find((type) => base64Image.includes(type));
    if (!imageType) {
      return res
        .status(400)
        .json({
          message:
            "Invalid base64 image type, please use png, webp, jpg, jpeg, gif, bmp, tiff, svg, heif, ico, avif",
        });
    }
    const imgBuffer = Buffer.from(base64Image.split(",")[1], "base64"); // Split and decode
    const imageName = prefixfilename
      ? prefixfilename + `.${imageType}`
      : Date.now() + `.${imageType}`; // Add file extension to image name
    const sizeInBytes = imgBuffer.length;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2); // Convert to MB
    const sizeInKB = (sizeInBytes / 1024).toFixed(2); // Convert to KB
    console.log(`Size: ${sizeInMB} MB, ${sizeInKB} KB`);
    console.log(imageName);
    const newurl = `${req.protocol}://${req.headers.host}/images/getImage/${imageName}`;
    const image = new Image({
      image: base64Image,
      imageName: imageName,
      imageUrl: newurl,
      projectName: projectName,
    });
    await image.save();
    res.status(200).json({ imageUrl: newurl }); // Return image URL instead of image data
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const image = await Image.findOne({ imageName: req.params.filename }); // Fetch the image by filename
    const imgwidth = parseInt(req.query.width as string); // Get the width from query and parse it to an integer
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const base64Image = image.image || process.env.IMAGE_STORAGE_UPLOAD_URL; // Get the base64 string for the favicon

    if (!base64Image) {
      return res.status(400).json({ message: "Image not found" });
    }

    if (!isValidBase64(base64Image)) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    const arrayoftype = [
      "png",
      "webp",
      "jpg",
      "jpeg",
      "gif",
      "bmp",
      "tiff",
      "svg+xml",
      "svg",
      "heif",
      "ico",
    ];

    const imageType = arrayoftype.find((type) => base64Image.includes(type));

    const imgBuffer = Buffer.from(base64Image.split(",")[1], "base64"); // Split and decode

    if (!imgBuffer || imgBuffer.length === 0) {
      return res.status(400).json({ message: "Image buffer is empty" });
    }

    let outputBuffer;

    // Resize the image using sharp if imgwidth is provided
    if (imgwidth) {
      outputBuffer = await sharp(imgBuffer)
        .resize({ width: imgwidth }) // Resize to the specified width
        .toBuffer();
    } else {
      outputBuffer = imgBuffer; // Use original size if imgwidth is not provided
    }

    res.writeHead(200, {
      "Content-Type": `image/${imageType}`,
      "Content-Length": outputBuffer.length,
    });
    res.end(outputBuffer); // Return the image data
  } catch (error) {
    console.log(error);
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
