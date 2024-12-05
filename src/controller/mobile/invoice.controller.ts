import { Response } from 'express';
import { RequestParams } from '../../utils/types/expressTypes';
import InvoiceSchema from '../../models/invoice.schema';
import validateParamsWithJoi from '../../utils/validateRequest';
import { getLanguage } from '../../language/languageHelper';
import { invoiceValidation } from '../../utils/validation/order.validation';
interface InvoiceType {
  companyName: string;
  address: string;

  logo?: string;
  header?: string;
  city?: string;
  footer?: string;
  merchantId: string;
}

export const createInvoice = async (req: RequestParams, res: Response) => {
  try {
    const validateRequest = validateParamsWithJoi<InvoiceType>(
      req.body,
      invoiceValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    // Check if invoice already exists for merchant
    const existingInvoice = await InvoiceSchema.findOne({
      merchantId: value.merchantId,
    });

    if (existingInvoice) {
      return res.badRequest({
        message: getLanguage('en').invoiceAlreadyExists,
      });
    }

    const invoice = await InvoiceSchema.create(value);

    return res.ok({
      message: getLanguage('en').invoiceCreatedSuccessfully,
      data: invoice,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const getInvoice = async (req: RequestParams, res: Response) => {
  try {
    const { merchantId } = req.params;

    const invoice = await InvoiceSchema.findOne({ merchantId });

    if (!invoice) {
      return res.badRequest({ message: getLanguage('en').invoiceNotFound });
    }

    return res.ok({
      data: invoice,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const updateInvoice = async (req: RequestParams, res: Response) => {
  try {
    const { merchantId } = req.params;
    const validateRequest = validateParamsWithJoi<InvoiceType>(
      req.body,
      invoiceValidation,
    );

    if (!validateRequest.isValid) {
      return res.badRequest({ message: validateRequest.message });
    }

    const { value } = validateRequest;

    const invoice = await InvoiceSchema.findOneAndUpdate(
      { merchantId },
      value,
      {
        new: true,
      },
    );

    if (!invoice) {
      return res.badRequest({ message: getLanguage('en').invoiceNotFound });
    }

    return res.ok({
      message: getLanguage('en').invoiceUpdatedSuccessfully,
      data: invoice,
    });
  } catch (error) {
    console.log(error);

    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};

export const deleteInvoice = async (req: RequestParams, res: Response) => {
  try {
    const { merchantId } = req.params;
    const invoice = await InvoiceSchema.findOneAndDelete({ merchantId });

    if (!invoice) {
      return res.badRequest({ message: getLanguage('en').invoiceNotFound });
    }

    return res.ok({
      message: getLanguage('en').invoiceDeletedSuccessfully,
    });
  } catch (error) {
    return res.failureResponse({
      message: getLanguage('en').somethingWentWrong,
    });
  }
};
