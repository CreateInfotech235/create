import WebFooter from '../../models/webFooter';
import { Request, Response } from 'express';

export const createWebFooter = async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request: Missing or invalid data",
            });
        }

        console.log("Create Web Footer", req.body);
        const webFooter = await WebFooter.create(req.body);

        res.status(201).json({
            status: 201,
            message: "Web Footer Created Successfully",
            webFooter,
        });
    } catch (error) {
        console.error("Error in createWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

export const getWebFooter = async (req: Request, res: Response) => {
    try {
        const webFooter = await WebFooter.findOne();

        if (!webFooter) {
            return res.status(404).json({
                status: 404,
                message: "Web Footer Not Found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Web Footer Fetched Successfully",
            webFooter,
        });
    } catch (error) {
        console.error("Error in getWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

export const updateWebFooter = async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request: Missing or invalid data",
            });
        }

        const webFooter = await WebFooter.findOneAndUpdate({}, req.body, { new: true });

        if (!webFooter) {
            return res.status(404).json({
                status: 404,
                message: "Web Footer Not Found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Web Footer Updated Successfully",
            webFooter,
        });
    } catch (error) {
        console.error("Error in updateWebFooter:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
