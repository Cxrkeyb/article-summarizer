import express from "express";
import { login, regenerateToken, registerUser } from "./controller/auth";

const router = express.Router();

/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario con la información proporcionada.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nombre de usuario del nuevo usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo electrónico del nuevo usuario.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del nuevo usuario.
 *               country:
 *                 type: string
 *                 description: País del nuevo usuario.
 *               phoneNumber:
 *                 type: string
 *                 description: Número de teléfono del nuevo usuario.
 *             required:
 *               - userName
 *               - email
 *               - password
 *               - phoneNumber
 *               - country
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado exitosamente
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltan datos obligatorios
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Inicia sesión para un usuario registrado.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token de acceso JWT
 *                 expires_at:
 *                   type: number
 *                   description: Tiempo de expiración del token JWT en formato Unix timestamp
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Faltan datos obligatorios
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña incorrecta
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/login", login);

/**
 * @openapi
 * /v1/auth/regenerate-token:
 *   post:
 *     summary: Regenerar token de acceso
 *     description: Regenera el token de acceso JWT para el usuario actual.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token regenerado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso JWT
 *                 expires_at:
 *                   type: number
 *                   description: Tiempo de expiración del token JWT en formato Unix timestamp
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post("/regenerate-token", regenerateToken);

export default router;
