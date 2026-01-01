import prisma from "./Connection.db.js";

const getClient = (model) => {
  const client = prisma[model];
  if (!client) {
    throw new Error("Model Not Found");
  }
  return client;
};

export const findMany = async ({ model }) => {
  return await getClient(model).findMany();
};

export const create = async ({ model, data }) => {
  return await getClient(model).create({ data });
};

export const findOne = async ({ model, where }) => {
  return await getClient(model).findUnique({ where });
};

export const findFirst = async ({ model, where }) => {
  return await getClient(model).findFirst({ where });
};
export const updateOne = async ({ model, where, data }) => {
  return await getClient(model).update({ where, data });
};
