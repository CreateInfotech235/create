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
exports.deleteMapApi = exports.updateMapApi = exports.getOneMapApi = exports.getAllmapApi = exports.mapApiCreate = void 0;
const mapApi_schema_1 = __importDefault(require("../../models/mapApi.schema"));
// Create a new map key
const mapApiCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mapKey, status } = req.body;
        if (!mapKey) {
            return res.status(400).json({ error: 'mapKey is required' });
        }
        const data = yield mapApi_schema_1.default.findOne({});
        if (data) {
            // Update existing HeroOurTeam instead of creating new one
            const updatedData = yield mapApi_schema_1.default.findByIdAndUpdate(data._id, {
                mapKey: mapKey,
                status: status
            }, { new: true });
            return res.status(200).json(updatedData);
        }
        const newMapApi = yield mapApi_schema_1.default.create({ mapKey, status });
        return res.status(201).json(newMapApi);
    }
    catch (error) {
        console.error('Error creating map key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.mapApiCreate = mapApiCreate;
// Get all map keys
const getAllmapApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mapKeys = yield mapApi_schema_1.default.find();
        return res.status(200).json(mapKeys);
    }
    catch (error) {
        console.error('Error fetching map keys:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllmapApi = getAllmapApi;
// Get a single map key by ID
const getOneMapApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const mapApi = yield mapApi_schema_1.default.findById(id);
        if (!mapApi) {
            return res.status(404).json({ error: 'Map key not found' });
        }
        return res.status(200).json(mapApi);
    }
    catch (error) {
        console.error('Error fetching map key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getOneMapApi = getOneMapApi;
// Update a map key by ID
const updateMapApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { mapKey } = req.body;
        if (!mapKey) {
            return res.status(400).json({ error: 'mapKey is required' });
        }
        const updatedMapApi = yield mapApi_schema_1.default.findByIdAndUpdate(id, { mapKey }, { new: true });
        if (!updatedMapApi) {
            return res.status(404).json({ error: 'Map key not found' });
        }
        return res.status(200).json(updatedMapApi);
    }
    catch (error) {
        console.error('Error updating map key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateMapApi = updateMapApi;
// Delete a map key by ID
const deleteMapApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMapApi = yield mapApi_schema_1.default.findByIdAndDelete(id);
        if (!deletedMapApi) {
            return res.status(404).json({ error: 'Map key not found' });
        }
        return res.status(200).json({ message: 'Map key deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting map key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteMapApi = deleteMapApi;
