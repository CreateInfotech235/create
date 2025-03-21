import MapApi from '../../models/mapApi.schema';
const getMapKey = async (req, res) => {
    // const apiKey = 'AIzaSyDB4WPFybdVL_23rMMOAcqIEsPaSsb-jzo';
    const mapKeys = await MapApi.find({status:true});
    if (!mapKeys) {
      return res.status(404).json({ error: "No map key found" });
    }

    res.json({ mapKeys });
};

export default getMapKey;

