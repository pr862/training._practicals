import { Request, Response } from "express";
import { UserRole } from "../types/user";
import { hashPassword, comparePassword } from "../utils/password";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  findAdmin,
  createUser,
} from "../models/user";


export const Register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === UserRole.ADMIN) {
      const adminExists = await findAdmin();

      if (adminExists) {
        return res.status(400).json({ message: "Admin already exists" });
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.CHEF,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({message: `${role || "User"} created successfully`,token,user: safeUser,});
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...safeUser } = user;

    return res.status(200).json({message: "Login successful",token, user: safeUser,});

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};