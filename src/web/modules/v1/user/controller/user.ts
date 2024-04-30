import { UserRepository } from "@/databases/postgresql/repos";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Buscar el usuario en la base de datos
    const user = await UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Respuesta exitosa
    return res.status(200).json(user);
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Buscar el usuario en la base de datos
    const user = await UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    await UserRepository.delete({ id: userId });

    // Respuesta exitosa
    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userName, email, password } = req.body;

    // Buscar el usuario en la base de datos
    let user = await UserRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar el usuario
    user = UserRepository.merge(user, {
      userName,
      email,
      password
    });

    user = await UserRepository.save(user);

    // Respuesta exitosa
    return res.status(200).json(user);
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
