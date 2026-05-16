import { Request, Response, NextFunction } from "express";

export const verifyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Acesso negado: Perfil não identificado." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado: Privilégios insuficientes." });
    }

    return next();
  };
};
