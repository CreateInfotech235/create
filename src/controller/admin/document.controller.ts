import { Response } from 'express';
import { SWITCH } from '../../enum';
import { getLanguage } from '../../language/languageHelper';
import DocumentSchema from '../../models/document.schema';
import { getMongoCommonPagination } from '../../utils/common';
import { RequestParams } from '../../utils/types/expressTypes';
import validateParamsWithJoi from '../../utils/validateRequest';
import { paginationValidation } from '../../utils/validation/adminSide.validation';
import {
  createDocumentValidation,
  deleteDocumentValidation,
  updateDocumentValidation,
} from '../../utils/validation/document.validation';

export const createDocument = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<{
      name: string;
      isRequired: boolean;
    }>(req.body, createDocumentValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const documentExist = await DocumentSchema.findOne({ name: value.name });

    if (documentExist) {
      return res.badRequest({
        message: getLanguage('en').errorDocumentAlreadyExist,
      });
    }

    await DocumentSchema.create(value);

    return res.ok({ message: getLanguage('en').documentCreated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateDocument = async (req: RequestParams, res: Response) => {
  try {
    req.body.documentId = req.params.documentId;

    const validateRequest = validateParamsWithJoi<{
      name: string;
      isRequired: boolean;
      documentId: string;
    }>(req.body, updateDocumentValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const documentExist = await DocumentSchema.findById(value.documentId);

    if (!documentExist) {
      return res.badRequest({
        message: getLanguage('en').errorDocumentNotFound,
      });
    }

    await DocumentSchema.updateOne(
      { _id: value.documentId },
      { $set: { name: value.name, isRequired: value.isRequired } },
    );

    return res.ok({ message: getLanguage('en').documentUpdated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteDocument = async (req: RequestParams, res: Response) => {
  try {
    req.params.status = req.query.status;

    const validateRequest = validateParamsWithJoi<{
      documentId: string;
      status: SWITCH;
    }>(req.params, deleteDocumentValidation);

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const documentExist = await DocumentSchema.findById(value.documentId);

    if (!documentExist) {
      return res.badRequest({
        message: getLanguage('en').errorDocumentNotFound,
      });
    }

    await DocumentSchema.updateOne(
      { _id: value.documentId },
      { $set: { status: value.status } },
    );

    return res.ok({ message: getLanguage('en').documentUpdated });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getDocuments = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<IPagination>(
      req.query,
      paginationValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    return res.ok({
      data: (
        await DocumentSchema.aggregate([
          {
            $project: {
              name: 1,
              isRequired: 1,
              isEnable: '$status',
            },
          },
          ...getMongoCommonPagination({
            pageCount: value.pageCount,
            pageLimit: value.pageLimit,
          }),
        ])
      )[0],
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
