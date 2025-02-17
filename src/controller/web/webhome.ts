import WebHome from '../../models/webHome.schema';
import { Request, Response } from 'express';

export const createWebHome = async (req: Request, res: Response) => {
    try {
        console.log("Create Web Home", req.body);
        const webHome = await WebHome.create(req.body);
        res.status(201).json({
            status: 201,
            message: "Web Home Created Successfully",
            webHome
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
}

export const getWebHome = async (req: Request, res: Response) => {
    try {
        const webHome = await WebHome.findOne();
        res.status(200).json({
            status: 200,
            message: "Web Home Fetched Successfully",
            webHome
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
}


export const updateWebHome = async (req: Request, res: Response) => {
    try {
        const webHome = await WebHome.findOneAndUpdate({}, req.body, { new: true });
        res.status(201).json({
            status: 201,
            message: "Web Home Updated Successfully",
            webHome
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error
        });
    }
}




