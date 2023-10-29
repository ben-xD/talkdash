export const throwDevError = (message?: string): never => {
  throw new Error(`Developer error: ${message}`);
};
