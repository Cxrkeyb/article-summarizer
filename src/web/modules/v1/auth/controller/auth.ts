import * as bcrypt from "bcrypt";
import { generateJwt, verifyJwt } from "@/services/JWT/jose";
import setCookie from "@/utils/setCookieJwt";
import config from "@/config";
import { UserRepository } from "@/databases/postgresql/repos";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar los datos de entrada
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Buscar el usuario en la base de datos
    const user = await UserRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar la contraseña
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const jwt = await generateJwt({ userId: user.id, sub: user.email }, config.jwt.AT_EXPIRE_HR);

    await setCookie(res, {
      id: user.id,
      email: user.email
    });

    // Respuesta exitosa
    return res.status(200).json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email
      },
      token: jwt,
      expires_at: Math.round(
        new Date(new Date().getTime() + config.jwt.AT_EXPIRE_TS).getTime() / 1000
      )
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    // Validar los datos de entrada
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Crear el usuario
    let user = UserRepository.create({
      userName,
      email,
      password
    });

    // Guardar el usuario en la base de datos
    user = await UserRepository.save(user);

    await setCookie(res, {
      id: user.id,
      email: user.email
    });

    const jwt = await generateJwt({ userId: user.id, sub: user.email }, config.jwt.AT_EXPIRE_HR);

    // Respuesta exitosa
    return res.status(201).json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email
      },
      token: jwt,
      expires_at: Math.round(
        new Date(new Date().getTime() + config.jwt.AT_EXPIRE_TS).getTime() / 1000
      )
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const regenerateToken = async (req: Request, res: Response) => {
  try {
    // Verificar si el token está en la cookie
    const jwtCookie = req.cookies[config.web.cookieName];

    if (!jwtCookie) {
      console.log("No se encontró el JWT en la cookie");
      return res.status(401).json({ message: "No autorizado" });
    }

    const payloadCookie = await verifyJwt(jwtCookie);

    if (!payloadCookie) {
      console.log("No se pudo verificar el JWT");
      return res.status(401).json({ message: "No autorizado" });
    }

    const payloadCooki: any = payloadCookie.payload;

    const jwtUser = await UserRepository.findOne({ where: { id: payloadCooki.userId } });

    if (!jwtUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (jwtUser.email !== payloadCooki.sub || jwtCookie !== jwtUser.refreshToken) {
      console.log("El JWT no coincide con el usuario");
      return res.status(401).json({ message: "No autorizado" });
    }

    const jwt = await generateJwt(
      { userId: payloadCooki.userId, sub: payloadCooki.sub },
      config.jwt.AT_EXPIRE_HR
    );

    // Respuesta exitosa
    return res.status(200).json({
      token: jwt,
      expires_at: Math.round(
        new Date(new Date().getTime() + config.jwt.AT_EXPIRE_TS).getTime() / 1000
      ),
      user: {
        id: jwtUser.id,
        userName: jwtUser.userName,
        email: jwtUser.email
      }
    });
  } catch (error) {
    console.error("Error al verificar el JWT:", error);
    return res.status(401).json({ message: "No autorizado" });
  }
};
