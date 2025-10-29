// middlewares/basicAuth.js
import { Request, Response, NextFunction } from "express";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = { login: "admin", password: "123456789" }; // ⚠️ Mets ça dans .env

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64").toString().split(":");

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Swagger"');
  res.status(401).send("Authentication required.");
};
