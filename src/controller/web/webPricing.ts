import WebPricing from '../../models/webPricing.schema';
import { Request, Response } from 'express';

export const createWebPricing = async (req: Request, res: Response) => {
    try {
        console.log("Create Web Pricing", req.body);
        const webPricing = await WebPricing.create(req.body);
        res.status(200).json(webPricing);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getWebPricing = async (req: Request, res: Response) => {
    try {
        const webPricing = await WebPricing.findOne();
        res.status(200).json(webPricing);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const updateWebPricing = async (req: Request, res: Response) => {
    try {
        const webPricing = await WebPricing.findOneAndUpdate({}, req.body, { new: true });
        res.status(200).json(webPricing);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}




