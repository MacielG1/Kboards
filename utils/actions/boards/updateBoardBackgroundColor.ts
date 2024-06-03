"use server";
import { revalidatePath } from "next/cache";
import prisma from "../../prisma";
import { updateBoardBackgroundColorSchema } from "../../schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export async function updateBoardBackgroundColor(data: z.infer<typeof updateBoardBackgroundColorSchema>) {
  let board;
  try {
    const { userId } = auth();

    if (!userId) {
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = updateBoardBackgroundColorSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateList validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { id, backgroundColor } = data;

    board = await prisma.board.update({
      where: {
        id,
      },
      data: {
        backgroundColor,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }
  revalidatePath(`/dashboard`);

  return {
    data: board,
  };
}
