import { Request, Response, NextFunction } from "express";
import config from "@/config";
import { verifyJwt } from "@/services/JWT/jose";

/**
 * Middleware para verificar el JWT en la cabecera Authorization o en una cookie.
 * @param req - El objeto de solicitud HTTP.
 * @param res - El objeto de respuesta HTTP.
 * @param next - Función para pasar el control al siguiente middleware.
 */
const verifyJwtInHeaderAndCookie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let jwtHeader: string | undefined;

    // Verificar si el token está en la cabecera Authorization
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      jwtHeader = req.headers.authorization.split(" ")[1];
    }
    // Verificar si el token está en la cookie
    const jwtCookie = req.cookies[config.web.cookieName];

    if (!jwtHeader || !jwtCookie) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (jwtHeader) {
      const payloadHeader = await verifyJwt(jwtHeader);
      if (!payloadHeader) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.body.jwtPayload = payloadHeader;
    }

    // Verificar el JWT de la cookie
    if (jwtCookie) {
      const payloadCookie = await verifyJwt(jwtCookie);
      if (!payloadCookie) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    // Continuar con la solicitud
    next();
  } catch (error) {
    console.error("Error al verificar el JWT:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyJwtInHeaderAndCookie;
