import { Response } from 'express';
import { responseData } from './types/expressTypes';
declare const _default: {
    successResponse: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    failureResponse: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    badRequest: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    insufficientParameters: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    unAuthorizedRequest: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    accessForbidden: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
    dataNotFound: (data: responseData, res: Response, lang: String) => Response<any, Record<string, any>>;
};
export default _default;
