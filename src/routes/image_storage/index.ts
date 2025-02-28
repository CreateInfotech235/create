import express from 'express';
import { uploadImage, getImage, updateImage, deleteImage } from "../../controller/image_storage/image.controller";

const router = express.Router();

router.post("/upload", uploadImage);

router.get("/getImage/:filename", getImage);

router.patch("/updateImage", updateImage);

router.delete("/deleteImage", deleteImage);



export default router;
