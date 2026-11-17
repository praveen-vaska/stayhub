import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET() {
  try {
    const allUsers = db.getAllUsers();
    const users = allUsers.filter((u) => u.role === "user");
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
