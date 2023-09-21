type Props = {
  content: string;
};

export default function ItemOverlay({ content }: Props) {
  return (
    <div className="bg-neutral-950 p-2.5 min-h-[5rem] items-center flex text-left rounded-xl relative hover:ring-2 hover:ring-inset hover:ring-blue-800 ">
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap cursor-pointer">{content}</p>
    </div>
  );
}