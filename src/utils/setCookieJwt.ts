import { Response } from "express";
import config from "@/config";
import { generateJwt } from "@/services/JWT/jose";
import { UserRepository } from "@/databases/postgresql/repos";

/**
 * Función para establecer una cookie en la respuesta HTTP.
 * @param res - El objeto de respuesta HTTP.
 * @param cookieName - El nombre de la cookie.
 * @param jwt - El JWT para almacenar en la cookie.
 */
const setCookie = async (res: Response, user: { id: string; email: string }) => {
  // Establecer la cookie en la respuesta
  const jwt = await generateJwt({ userId: user.id, sub: user.email }, config.jwt.RT_EXPIRE_HR);

  await UserRepository.update(user.id, { refreshToken: jwt });

  console.log("Cookie set:", jwt);

  res.cookie(config.web.cookieName, jwt, {
    httpOnly: true,
    domain: !config.web.appUrl.match(/^(http(s)?:\/\/localhost)/)
      ? config.web.appUrl.replace(/(^\w+:|^)\/\//, "")
      : undefined,
    sameSite: !config.web.appUrl.match(/^(http(s)?:\/\/localhost)/) ? "strict" : undefined,
    expires: new Date(new Date().getTime() + config.jwt.RT_EXPIRE_TS)
  });
};

export default setCookie;
