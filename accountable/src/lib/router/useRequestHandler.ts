import { RequestHandler, Response, Router } from "express";
import { AnySchema, isError as isValidationError } from "joi";
import { Token, requireAuth } from "../passport";
import logger from "../util/logger";

export class RequestHandlerError implements Error {
  public name: string;
  public message: string;
  public statusCode: number;
  public responseMessage: string;

  constructor(statusCode: number, message: string, responseMessage?: string) {
    this.name = "RouterError";
    this.message = message;
    this.statusCode = statusCode;
    this.responseMessage = responseMessage || message;
  }
}

export type RequestHandlerRequest<Query, Params, ReqBody, NoAuth> = {
  query: Query;
  params: Params;
  body: ReqBody;
  token: NoAuth extends true ? undefined : Token;
};

export type RequestHandlerResponse<ResBody> = {
  status: number;
  body?: ResBody;
};

export type UseRequestHandlerConfig<
  Query,
  Params,
  ReqBody,
  ResBody,
  NoAuth,
> = {
  router: Router;
  path?: string;
  noAuth?: NoAuth;
  method: "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head";
  requestHandler: (req: RequestHandlerRequest<Query, Params, ReqBody, NoAuth>, res: Response) =>
    Promise<RequestHandlerResponse<ResBody>> | RequestHandlerResponse<ResBody>;
  querySchema?: AnySchema<Query>;
  paramsSchema?: AnySchema<Params>;
  bodySchema?: AnySchema<ReqBody>;
};

export const useRequestHandler = <
  Query extends qs.ParsedQs,
  Params extends { [key: string]: string },
  ReqBody,
  ResBody,
  NoAuth extends boolean = false,
>({
  router,
  path,
  noAuth,
  method,
  requestHandler,
  querySchema, paramsSchema, bodySchema,
}: UseRequestHandlerConfig<Query, Params, ReqBody, ResBody, NoAuth>
) => {
  type _ResBody = ResBody | { message: string } | { messages: string[] };
  const handler: RequestHandler<Params, _ResBody, ReqBody, Query, Record<string, any>>
    = async (req, res) => {
      try {
        // validation
        const option = { abortEarly: false };
        await Promise.all([
          querySchema?.validateAsync(req.query, option),
          paramsSchema?.validateAsync(req.params, option),
          bodySchema?.validateAsync(req.body, option),
        ]);

        // request handler
        const response = await requestHandler({
          query: req.query,
          params: req.params,
          body: req.body,
          token: req.user as NoAuth extends true ? undefined : Token,
        }, res);

        // send response
        res.status(response.status)[response.body ? "send" : "end"](response.body);
      } catch (error) {
        if (error instanceof RequestHandlerError) {
          // handle RequestHandlerError
          res.status(error.statusCode).send({
            message: error.responseMessage,
          });
        } else if (isValidationError(error)) {
          // handle validation error
          const messages = error.details.map(({ message }) => message);
          res.status(400).send({ messages });
        } else {
          // handle unknown error
          res.status(500).send({
            message: "An unknown error has occurred.",
          });
          logger.error("unknown error: ", error);
        }
      }
    };

  router[method](path || "", requireAuth(!noAuth), handler);
};
