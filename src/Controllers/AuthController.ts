import { Request, Response } from "express";
import User from "../Models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   REGISTER
========================= */
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  // ✅ Validação de tipos (TypeScript-friendly)
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  // 🔒 Verifica se usuário já existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ error: "Usuário já cadastrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // ❌ Nunca retorne a senha (nem hash)
  return res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
}

/* =========================
   LOGIN
========================= */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // ✅ Validação de tipos
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const user = await User.findOne({ email });

  if (!user || typeof user.password !== "string") {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET não configurado" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
