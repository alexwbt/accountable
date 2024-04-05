import express from "express";
import Joi from "joi";
import { Token } from "../passport";
import { RequestHandlerError, useRequestHandler } from "./useRequestHandler";

export type PaginationResponse<GetResponse> = {
  page: number;
  size: number;
  total: number;
  items: GetResponse[];
};

export type BaseSearchQuery = {
  page: string | undefined,
  size: string | undefined,
};
export const BaseSearchQuerySchema = Joi.object<BaseSearchQuery>({
  page: Joi.number().min(0),
  size: Joi.number().min(1),
});

export interface CrudService<
  GetResponse,
  SearchQuery extends BaseSearchQuery,
  CreateRequest,
  UpdateRequest,
  Authorized,
> {
  select: (id: string, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  search: (query: Omit<SearchQuery, "page" | "size"> & { page: number, size: number }, token: Authorized extends true ? Token : undefined) => Promise<PaginationResponse<GetResponse>>;
  create: (request: CreateRequest, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  update: (id: string, request: UpdateRequest, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  remove: (id: string, token: Authorized extends true ? Token : undefined) => Promise<void>;
}

export const createCrudRouter = <
  GetResponse,
  SearchQuery extends BaseSearchQuery,
  CreateRequest,
  UpdateRequest,
  Authorized extends boolean = false,
>(
  IdParamSchema: Joi.ObjectSchema<{ id: string }>,
  SearchQuerySchema: Joi.ObjectSchema<SearchQuery>,
  CreateRequestSchema: Joi.ObjectSchema<CreateRequest>,
  UpdateRequestSchema: Joi.ObjectSchema<UpdateRequest>,
  crudService: CrudService<GetResponse, SearchQuery, CreateRequest, UpdateRequest, Authorized>,
  authorized?: Authorized,
  readRoles?: Authorized extends true ? string[] : undefined,
  writeRoles?: Authorized extends true ? string[] : undefined,
) => {
  const crudRouter = express.Router();

  const BaseSearchQuerySchema_ = Joi.object<SearchQuery>({
    page: Joi.number().min(0),
    size: Joi.number().min(1),
  });
  // get
  useRequestHandler({
    router: crudRouter, method: "get", path: "/:id",
    authorized, roles: readRoles,
    paramsSchema: IdParamSchema,
    requestHandler: async ({ token, params: { id } }) => {
      try {
        const item = await crudService.select(id, token);
        if (!item) throw new RequestHandlerError(400, "Item does not exist.");
        return { status: 200, body: item };
      } catch (e) {
        if (e instanceof RequestHandlerError) throw e;
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  // get list
  useRequestHandler({
    router: crudRouter, method: "get",
    authorized, roles: readRoles,
    querySchema: SearchQuerySchema.concat(BaseSearchQuerySchema_),
    requestHandler: async ({ token, query, }) => {
      try {
        const result = await crudService.search({
          ...query,
          page: +(query.page || 0),
          size: +(query.size || 10),
        }, token);
        return { status: 200, body: result };
      } catch (e) {
        if (e instanceof RequestHandlerError) throw e;
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  // create
  useRequestHandler({
    router: crudRouter, method: "post",
    authorized, roles: writeRoles,
    bodySchema: CreateRequestSchema,
    requestHandler: async ({ token, body }) => {
      try {
        const item = await crudService.create(body, token);
        return { status: 200, body: item };
      } catch (e) {
        if (e instanceof RequestHandlerError) throw e;
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  // update
  useRequestHandler({
    router: crudRouter, method: "patch", path: "/:id",
    authorized, roles: writeRoles,
    paramsSchema: IdParamSchema, bodySchema: UpdateRequestSchema,
    requestHandler: async ({ token, body, params: { id } }) => {
      try {
        const item = await crudService.update(id, body, token);
        return { status: 200, body: item };
      } catch (e) {
        if (e instanceof RequestHandlerError) throw e;
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  // delete
  useRequestHandler({
    router: crudRouter, method: "delete", path: "/:id",
    authorized, roles: writeRoles,
    paramsSchema: IdParamSchema,
    requestHandler: async ({ token, params: { id } }) => {
      try {
        await crudService.remove(id, token);
        return { status: 200 };
      } catch (e) {
        if (e instanceof RequestHandlerError) throw e;
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  return crudRouter;
};
