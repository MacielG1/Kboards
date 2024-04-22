"use server";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import type { ItemType } from "@/store/store";
import prisma from "../../prisma";
import { UpdateItemOrderSchema } from "../../schemas";

export async function updateItemOrder(data: { items: ItemType[]; boardId: string }) {
  let updatedItems;
  try {
    const { userId } = auth();

    if (!userId) {
      console.log("Unauthorized");
      return {
        error: "Unauthorized",
      };
    }

    const validationResult = UpdateItemOrderSchema.safeParse(data);
    if (!validationResult.success) {
      console.log("updateItemOrder validationResult.error.flatten().fieldErrors", validationResult.error.flatten().fieldErrors);
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const { items, boardId } = data;

    const transaction = items.map((item) =>
      prisma.item.update({
        where: {
          id: item.id,
          list: {
            boardId,
          },
        },
        data: {
          order: item.order,
          listId: item.listId,
        },
      }),
    );

    updatedItems = await prisma.$transaction(transaction);
  } catch (error) {
    console.log("Failed to reorder items", error);
    return {
      error: "Failed to reorder items",
    };
  }
  revalidatePath(`/dashboard/${data.boardId}`);

  return {
    data: updatedItems,
  };
}