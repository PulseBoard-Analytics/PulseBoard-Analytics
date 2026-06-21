"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUpSchema, type SignUpInput } from "@/lib/validations";
import type { ActionResult } from "@/lib/types";

export async function registerUser(
  input: SignUpInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { name, email, passwordHash },
    select: { id: true },
  });

  return { success: true, data: { id: user.id } };
}
