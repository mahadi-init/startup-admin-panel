"use client";
import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full">
      {!pending ? (
        <p>{text}</p>
      ) : (
        <div className="flex items-center gap-2">
          <Loader className="animate-spin duration-1000" />
          <p>Loading...</p>
        </div>
      )}
    </Button>
  );
}
