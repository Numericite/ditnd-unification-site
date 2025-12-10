import type { PayloadRequest } from "payload";

export const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const user = req.user;

  if (!user) return false;

  return user.role === "admin";
};
