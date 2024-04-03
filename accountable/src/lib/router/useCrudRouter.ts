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

export interface CrudService<
  GetResponse,
  CreateRequest,
  UpdateRequest,
  Authorized,
> {
  select: (id: string, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  search: (page: number, size: number, token: Authorized extends true ? Token : undefined) => Promise<PaginationResponse<GetResponse>>;
  create: (request: CreateRequest, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  update: (id: string, request: UpdateRequest, token: Authorized extends true ? Token : undefined) => Promise<GetResponse>;
  remove: (id: string, token: Authorized extends true ? Token : undefined) => Promise<void>;
}

const SearchQuerySchema = Joi.object<{
  page: string | undefined,
  size: string | undefined,
}>({
  page: Joi.number().min(0),
  size: Joi.number().min(1),
});

export const createCrudRouter = <
  GetResponse,
  CreateRequest,
  UpdateRequest,
  Authorized extends boolean = false,
>(
  IdParamSchema: Joi.ObjectSchema<{ id: string }>,
  CreateRequestSchema: Joi.ObjectSchema<CreateRequest>,
  UpdateRequestSchema: Joi.ObjectSchema<UpdateRequest>,
  crudService: CrudService<GetResponse, CreateRequest, UpdateRequest, Authorized>,
  authorized?: Authorized,
  readRoles?: Authorized extends true ? string[] : undefined,
  writeRoles?: Authorized extends true ? string[] : undefined,
) => {
  const crudRouter = express.Router();
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
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  // get list
  useRequestHandler({
    router: crudRouter, method: "get",
    authorized, roles: readRoles,
    querySchema: SearchQuerySchema,
    requestHandler: async ({ token, query: { page, size } }) => {
      try {
        const result = await crudService.search(+(page || 0), +(size || 10), token);
        return { status: 200, body: result };
      } catch (e) {
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
        throw new RequestHandlerError(400, `${e}`, "Invalid Request.");
      }
    },
  });
  return crudRouter;
};
