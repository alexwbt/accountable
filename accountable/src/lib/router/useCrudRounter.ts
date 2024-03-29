import express from "express";
import Joi from "joi";
import { useRequestHandler } from "./useRequestHandler";

export type PaginationResponse<GetResponse> = {
  total: number;
  items: GetResponse[];
};

export interface CrudService<
  ID,
  GetResponse,
  CreateRequest,
  UpdateRequest,
> {
  select: (id: ID) => Promise<GetResponse>;
  search: (page: number, size: number) => Promise<PaginationResponse<GetResponse>>;
  create: (request: CreateRequest) => Promise<GetResponse>;
  update: (id: ID, request: UpdateRequest) => Promise<GetResponse>;
  remove: (id: ID) => Promise<void>;
}

const SearchQuerySchema = Joi.object({
  page: Joi.number().min(0),
  size: Joi.number().min(1),
});

export const createCrudRouter = <
  ID,
  GetResponse,
  CreateRequest,
  UpdateRequest,
>(
  IdSchema: Joi.ObjectSchema<{ id: ID }>,
  CreateRequestSchema: Joi.ObjectSchema<CreateRequest>,
  UpdateRequestSchema: Joi.ObjectSchema<UpdateRequest>,
  crudService: CrudService<ID, GetResponse, CreateRequest, UpdateRequest>,
) => {
  const crudRouter = express.Router();
  // get
  useRequestHandler({
    router: crudRouter, method: "get", path: ":id",
    paramsSchema: IdSchema,
    requestHandler: async ({ params: { id } }) =>
      ({ status: 200, body: await crudService.select(id) }),
  });
  // get list
  useRequestHandler({
    router: crudRouter, method: "get",
    querySchema: SearchQuerySchema,
    requestHandler: async ({ query: { page, size } }) =>
      ({ status: 200, body: await crudService.search(page, size) }),
  });
  // create
  useRequestHandler({
    router: crudRouter, method: "post",
    bodySchema: CreateRequestSchema,
    requestHandler: async ({ body }) =>
      ({ status: 200, body: await crudService.create(body) }),
  });
  // update
  useRequestHandler({
    router: crudRouter, method: "patch", path: ":id",
    paramsSchema: IdSchema, bodySchema: UpdateRequestSchema,
    requestHandler: async ({ body, params: { id } }) =>
      ({ status: 200, body: await crudService.update(id, body) }),
  });
  // delete
  useRequestHandler({
    router: crudRouter, method: "delete", path: ":id",
    paramsSchema: IdSchema,
    requestHandler: async ({ params: { id } }) =>
      ({ status: 200, body: await crudService.remove(id) }),
  });
};
