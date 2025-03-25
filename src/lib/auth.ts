import { compare, hash } from "bcryptjs";
import { connectToDatabase } from "./mongodb";

// Fungsi untuk mencari user berdasarkan email
export async function getUserByEmail(email: string) {
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });
  return user;
}

// Fungsi untuk membuat user baru
export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const { db } = await connectToDatabase();

  // Cek apakah email sudah digunakan
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email sudah digunakan");
  }

  // Hash password
  const hashedPassword = await hash(password, 10);

  // Buat user baru
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role: "user", // Default role untuk user baru
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: result.insertedId.toString(),
    name,
    email,
    role: "user",
  };
}

// Fungsi untuk memverifikasi password
export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return compare(plainPassword, hashedPassword);
}
