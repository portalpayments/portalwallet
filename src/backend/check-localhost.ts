// TODO: move this somewhere else, debugging weird circular dependencies issue right now

export const checkIsLocalhost = (rpcEndpoint: string) => {
  return rpcEndpoint.includes("127.0.0.1") || rpcEndpoint.includes("localhost");
};
