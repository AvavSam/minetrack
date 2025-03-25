import { connectToDatabase } from "./mongodb";

export async function getAllUsers() {
  const { db } = await connectToDatabase();

  const users = await db.collection("users").find({}).toArray();

  // Transform the data for the client
  return users.map((user: any) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));
}
