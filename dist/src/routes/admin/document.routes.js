"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const document_controller_1 = require("../../controller/admin/document.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /admin/document/create:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Create Document
 *     tags: [ Admin - Delivery Man Documents ]
 *     requestBody:
 *      description: create document
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateDocument"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.post('/create', document_controller_1.createDocument);
/**
 * @swagger
 * /admin/document/{documentId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Update Document
 *     tags: [ Admin - Delivery Man Documents ]
 *     parameters:
 *     - name: documentId
 *       in: path
 *     requestBody:
 *      description: update document
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/AdminCreateDocument"
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.patch('/:documentId', document_controller_1.updateDocument);
/**
 * @swagger
 * /admin/document/{documentId}:
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     summary: Delete Document
 *     tags: [ Admin - Delivery Man Documents ]
 *     parameters:
 *     - name: documentId
 *       in: path
 *     - name: status
 *       in: query
 *       schema:
 *        type: string
 *        enum:
 *        - ENABLE
 *        - DISABLE
 *        example: DISABLE
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.delete('/:documentId', document_controller_1.deleteDocument);
/**
 * @swagger
 * /admin/document:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Documents
 *     tags: [ Admin - Delivery Man Documents ]
 *     parameters:
 *     - name: pageCount
 *       in: query
 *     - name: pageLimit
 *       in: query
 *     responses:
 *       200:
 *         description: Your request is successfully executed.
 *       400:
 *         description: Bad Request Client Error
 *       500:
 *         description: Something went wrong
 */
router.get('/', document_controller_1.getDocuments);
exports.default = router;
