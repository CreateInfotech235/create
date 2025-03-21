import { Response } from 'express';
import MapApi from '../../models/mapApi.schema';
import { RequestParams } from '../../utils/types/expressTypes';

// Create a new map key
export const mapApiCreate = async (req: RequestParams, res: Response) => {
  try {
    const { mapKey } = req.body;
    console.log(mapKey);

    if (!mapKey) {
      return res.status(400).json({ error: 'mapKey is required' });
    }

    const data = await MapApi.findOne({});
    if (data) {
      // Update existing HeroOurTeam instead of creating new one
      const updatedData = await MapApi.findByIdAndUpdate(
        data._id,
        {
          mapKey: mapKey,
        },
        { new: true },
      );
      //   return res.status(200).json(updatedData);
      return res.ok({
        data: updatedData,
      });
    }

    const newMapApi = await MapApi.create({ mapKey });
    // return res.status(201).json(newMapApi);
    return res.ok({
      data: newMapApi,
    });
  } catch (error) {
    console.error('Error creating map key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all map keys
export const getAllmapApi = async (req: RequestParams, res: Response) => {
  try {
    const mapKeys = await MapApi.find({status:true});
    if (!mapKeys) {
      return res.status(404).json({ error: "No map key found" });
    }


    return res.status(200).json(mapKeys);
  } catch (error) {
    console.error('Error fetching map keys:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single map key by ID
export const getOneMapApi = async (req: RequestParams, res: Response) => {
  try {
    const mapApi = await MapApi.findOne({});

    if (!mapApi) {
      return res.status(404).json({ error: 'Map key not found' });
    }

    return res.status(200).json(mapApi);
  } catch (error) {
    console.error('Error fetching map key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a map key by ID
export const updateMapApi = async (req: RequestParams, res: Response) => {
  try {
    const { mapKey, status } = req.body;
    console.log(req.body);


    if (!mapKey) {
      return res.status(400).json({ error: 'mapKey is required' });
    }

    const updatedMapApi = await MapApi.findOneAndUpdate(
      {},
      {
        status: status,
      },
      { new: true }, // Return the updated document
    );

    if (!updatedMapApi) {
      return res.status(404).json({ error: 'Map key not found' });
    }

    return res.status(200).json(updatedMapApi);
  } catch (error) {
    console.error('Error updating map key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a map key by ID
export const deleteMapApi = async (req: RequestParams, res: Response) => {
  try {
    const deletedMapApi = await MapApi.findOneAndDelete({});

    if (!deletedMapApi) {
      return res.status(404).json({ error: 'Map key not found' });
    }

    return res.status(200).json({ message: 'Map key deleted successfully' });
  } catch (error) {
    console.error('Error deleting map key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
