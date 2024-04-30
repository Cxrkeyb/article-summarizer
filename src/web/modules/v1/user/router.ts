import express from "express";
import { deleteUser, getUser, updateUser } from "./controller/user";
import verifyJwtInHeaderAndCookie from "@/web/middlewares/verifyJwt";

const router = express.Router();

/**
 * @openapi
 * /v1/user/{userId}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Obtiene los detalles de un usuario según su ID.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a obtener.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.get("/:userId", verifyJwtInHeaderAndCookie, getUser);

/**
 * @openapi
 * /v1/user/{userId}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los detalles de un usuario existente.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nuevo nombre de usuario del usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nueva dirección de correo electrónico del usuario.
 *               country:
 *                 type: string
 *                 description: Nuevo país del usuario.
 *               phoneNumber:
 *                 type: string
 *                 description: Nuevo número de teléfono del usuario.
 *             required:
 *               - userName
 *               - email
 *               - phoneNumber
 *               - country
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.put("/:userId", verifyJwtInHeaderAndCookie, updateUser);

/**
 * @openapi
 * /v1/user/{userId}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario existente según su ID.
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.delete("/:userId", verifyJwtInHeaderAndCookie, deleteUser);

export default router;
