import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, role = "user" } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const newUser = db.createUser({
      name,
      email,
      phone,
      role: role === "owner" ? "owner" : "user",
      avatar: `https://images.unsplash.com/photo-${role === "owner" ? "1570295999919-56ceb5ecca61" : "1535713875002-d1d0cf377fde"}?auto=format&fit=crop&w=150&q=80`,
    });

    const token = signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: newUser,
      token,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
