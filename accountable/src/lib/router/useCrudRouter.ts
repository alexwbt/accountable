import express from "express";
import Joi from "joi";
import { useRequestHandler } from "./useRequestHandler";

export type PaginationResponse<GetResponse> = {
  total: number;
  items: GetResponse[];
};

export interface CrudService<
  GetResponse,
  CreateRequest,
  UpdateRequest,
> {
  select: (id: string) => Promise<GetResponse>;
  search: (page: number, size: number) => Promise<PaginationResponse<GetResponse>>;
  create: (request: CreateRequest) => Promise<GetResponse>;
  update: (id: string, request: UpdateRequest) => Promise<GetResponse>;
  remove: (id: string) => Promise<void>;
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
>(
  IdParamSchema: Joi.ObjectSchema<{ id: string }>,
  CreateRequestSchema: Joi.ObjectSchema<CreateRequest>,
  UpdateRequestSchema: Joi.ObjectSchema<UpdateRequest>,
  crudService: CrudService<GetResponse, CreateRequest, UpdateRequest>,
) => {
  const crudRouter = express.Router();
  // get
  useRequestHandler({
    router: crudRouter, method: "get", path: "/:id",
    paramsSchema: IdParamSchema,
    requestHandler: async ({ params: { id } }) =>
      ({ status: 200, body: await crudService.select(id) }),
  });
  // get list
  useRequestHandler({
    router: crudRouter, method: "get",
    querySchema: SearchQuerySchema,
    requestHandler: async ({ query: { page, size } }) =>
      ({ status: 200, body: await crudService.search(+(page || 0), +(size || 10)) }),
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
    router: crudRouter, method: "patch", path: "/:id",
    paramsSchema: IdParamSchema, bodySchema: UpdateRequestSchema,
    requestHandler: async ({ body, params: { id } }) =>
      ({ status: 200, body: await crudService.update(id, body) }),
  });
  // delete
  useRequestHandler({
    router: crudRouter, method: "delete", path: "/:id",
    paramsSchema: IdParamSchema,
    requestHandler: async ({ params: { id } }) =>
      ({ status: 200, body: await crudService.remove(id) }),
  });
  return crudRouter;
};
