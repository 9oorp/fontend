import React, { useState } from "react";
import CommentInput from "./CommentInput";

interface Props {
  setEdit: (value: boolean) => void;
  value: string;
  handleSubmit: (e: React.FormEvent, value: string) => void;
}

export default function CommentForm({ setEdit, value, handleSubmit }: Props) {
  const [content, setContent] = useState<string>(value);

  return (
    <form onSubmit={(e) => handleSubmit(e, content)}>
      <CommentInput isEditable={true} value={content} onChange={setContent} />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEdit(false)}
          className="bg-gray-400 text-sm px-2 rounded-md text-white"
        >
          취소
        </button>
        <button
          type="submit"
          className="bg-gray-400 text-sm px-2 rounded-md text-white mx-1"
        >
          등록
        </button>
      </div>
    </form>
  );
}
