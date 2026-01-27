export const destructData = ({ body, allowed }) => {
  return Object.keys(body).reduce((acc, key) => {
    if (allowed.includes(key)) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};
