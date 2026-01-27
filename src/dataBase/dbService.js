import prisma from "./Connection.db.js";

const getClient = (model) => {
  const client = prisma[model];
  if (!client) {
    throw new Error("Model Not Found");
  }
  return client;
};

export const findMany = async ({ model, where = {} }) => {
  return await getClient(model).findMany({ where });
};

export const findManyWithPaginationAndCount = async ({
  model,
  where = {},
  page = 1,
  limit = 20,
  orderBy = { createdAt: "desc" },
  select,
  include,
}) => {
  const client = getClient(model);

  const take = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const p = Math.max(Number(page) || 1, 1);
  const skip = (p - 1) * take;

  const [items, totalItems] = await Promise.all([
    client.findMany({
      where,
      take,
      skip,
      orderBy,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    }),
    client.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / take);
  const hasNextPage = p < totalPages;

  return { items, pagination: { page: p, limit: take, totalItems, totalPages, hasNextPage } };
};



export const create = async ({ model, data }) => {
  return await getClient(model).create({ data });
};

export const findOne = async ({ model, where }) => {
  return await getClient(model).findUnique({ where });
};

export const findFirst = async ({ model, where, include = {} }) => {
  return await getClient(model).findFirst({ where, include });
};
export const updateOne = async ({ model, where, data }) => {
  return await getClient(model).update({ where, data });
};

export const updateMany = async ({ model, where, data }) => {
  return await getClient(model).updateMany({ where, data });
};
