"use client";

import { ElementRef, RefObject, forwardRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "../Form/FormInput";
import { useStore } from "@/store/store";
import { Button } from "../ui/button";
import { PlusIcon, X } from "lucide-react";
import FormButton from "../Form/FormButton";
import FormTextArea from "../Form/FormTextArea";
import { v4 as uuidv4 } from "uuid";

export default function AddBoard() {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const addBoard = useStore((state) => state.addBoard);
  const currentBoardId = useStore((state) => state.currentBoardId);

  const setCurrentBoardId = useStore((state) => state.setCurrentBoardId);

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }

  function disableEditing() {
    setIsEditing(false);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      disableEditing();
    }
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;

    if (!title) return;

    const newBoard = {
      id: uuidv4(),
      name: title,
      lists: [],
    };
    addBoard(newBoard);
    setCurrentBoardId(newBoard.id);

    formRef.current?.reset();
    disableEditing();

    // setTimeout(() => {
    //   // this method until hello-pangea/dnd adds support for nested scroll
    //   window.scrollTo({
    //     left: document.documentElement.scrollWidth,
    //     behavior: "smooth",
    //   });
    // }, 1000);
  }

  if (isEditing) {
    return (
      <div className="h-full w-[10rem] select-none ">
        <form action={handleSubmit} ref={formRef} className="w-full space-y-1 rounded-md bg-white p-2 py-3 shadow-md dark:bg-neutral-700">
          <FormInput
            id="title"
            ref={inputRef}
            className="
            h-9
            w-full border-transparent px-2 py-1 font-medium transition hover:border-input focus:border-input dark:focus-visible:bg-transparent"
            placeholder="Enter Board Name"
          />
          <p className="flex items-center justify-center gap-1 pt-2 ">
            <FormButton size={"superSmall"} variant="accent">
              Add Board
            </FormButton>
            <Button variant="ghost" size="superSmall" onClick={disableEditing} className="dark:hover:bg-neutral-800">
              <X className="size-5" />
            </Button>
          </p>
        </form>
      </div>
    );
  }
  return (
    <div className="h-full w-[8rem] shrink-0 select-none">
      <button
        onClick={enableEditing}
        className="flex w-full items-center justify-center rounded-xl bg-neutral-400/50 p-2 py-[0.6rem] text-sm font-medium transition duration-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-700/80"
      >
        <PlusIcon className="mr-2 size-4" />
        Add Board
      </button>
    </div>
  );
}