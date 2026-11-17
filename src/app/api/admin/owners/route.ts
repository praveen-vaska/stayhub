import { NextResponse } from "next/server";
import { db } from "@/lib/db/storage";

export async function GET() {
  try {
    const allUsers = db.getAllUsers();
    const owners = allUsers.filter((u) => u.role === "owner");
    return NextResponse.json({ owners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
