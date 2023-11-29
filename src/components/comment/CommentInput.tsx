import React, { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";

interface Props {
  isEditable: boolean;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

export default function CommentInput({ isEditable, value, onChange }: Props) {
  const textarea = useRef<any>();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = textarea.current.scrollHeight + "px";
    }
    onChange(e.target.value);
  };

  return (
    <div>
      {isEditable ? (
        <textarea
          className="w-full border p-2 overflow-hidden resize-none"
          ref={textarea}
          value={value}
          onChange={(e) => handleChange(e)}
          placeholder="댓글을 남겨보세요."
          rows={3}
        ></textarea>
      ) : (
        <textarea
          className="w-full border rounded-lg mr-2 p-2 overflow-hidden resize-none"
          readOnly
          onFocus={(e) => e.target.blur()}
          ref={textarea}
          tabIndex={-1}
          placeholder="로그인이 필요한 서비스입니다."
          rows={3}
        ></textarea>
      )}
    </div>
  );
}
