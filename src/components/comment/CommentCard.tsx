import React, { useState } from "react";
import { commentRequest, commentResponse } from "../../types/commentType";
import { ReactComponent as ArrowSVG } from "../../assets/arrow-return-right.svg";

import store from "../../store";
import CommentForm from "./CommentForm";
import axios from "axios";
import requests from "../../api/requests";
import { refreshAccessToken } from "../../api/manageToken";

interface Props {
  postId: number;
  comment: commentResponse;
  isReply: boolean;
  isLast: boolean;
  fetchComments: () => Promise<void>;
}

export default function CommentCard({
  postId,
  comment,
  isReply,
  isLast,
  fetchComments,
}: Props) {
  const user = store.getState().user.userData;

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [addReply, setAddReply] = useState<boolean>(false);

  const handleReplySubmit = async (e: React.FormEvent, content: string) => {
    e.preventDefault();

    const requestData: commentRequest = {
      content: content,
      parentCommentId: comment.id,
    };

    try {
      const response = await axios.post(
        // process.env.REACT_APP_DB_HOST +
        `${requests.fetchPost}/${postId}/comments`,
        requestData,
        { headers }
      );

      if (response.data.errorMessage === "토큰 만료") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);

          const newHeaders = {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          };

          const newResponse = await axios.post(
            // process.env.REACT_APP_DB_HOST +
            `${requests.fetchPost}/${postId}/comments`,
            requestData,
            {
              headers: newHeaders,
            }
          );
        } else {
          // console.error(
          //   "refresh token이 없습니다. 로그인 페이지로 이동하거나 다른 처리를 수행하세요."
          // );
        }
      }

      fetchComments();
    } catch (error) {
      // console.error("POST 요청 실패", error);
    }
    setAddReply(false);
  };

  const handleCommentUpdateSubmit = async (
    e: React.FormEvent,
    content: string
  ) => {
    e.preventDefault();

    const requestData: commentRequest = {
      content: content,
      parentCommentId: comment.id,
    };

    // * update api가 없나??..
    try {
      const response = await axios.post(
        // process.env.REACT_APP_DB_HOST +
        `${requests.fetchPost}/${postId}/comments`,
        requestData,
        { headers }
      );

      if (response.data.errorMessage === "토큰 만료") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken);

          const newHeaders = {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          };

          const newResponse = await axios.post(
            // process.env.REACT_APP_DB_HOST +
            `${requests.fetchPost}/${postId}/comments`,
            requestData,
            {
              headers: newHeaders,
            }
          );
        } else {
          // console.error(
          //   "refresh token이 없습니다. 로그인 페이지로 이동하거나 다른 처리를 수행하세요."
          // );
        }
      }

      fetchComments();
    } catch (error) {
      // console.error("POST 요청 실패", error);
    }

    setIsEdit(false);
  };

  const handleCommentDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        `${requests.fetchPost}/${postId}/comments/${comment.id}`,
        { headers }
      );
      fetchComments();
    } catch (error) {
      // console.error("DELETE 요청 실패", error);
    }
  };

  const borderClass = isReply
    ? isLast
      ? "border-b-[1px]"
      : ""
    : isLast && comment.replies.length === 0
    ? "border-y-[1px]"
    : "border-t-[1px]";

  return (
    <div className="grow">
      <div className={`w-full px-6 py-4 ${borderClass} border-gray-150`}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-3 pb-2">
            <p className="font-medium text-medium">{comment.accountId}</p>
            <p className="text-sm font-light text-gray-400">
              {comment.createdAt
                .slice(0, 16)
                .replace("T", " ")
                .replaceAll("-", ".")}
            </p>
          </div>

          {user?.memberName === comment.accountId && (
            <div className="flex gap-2 text-sm">
              {/* <button className="text-gray-400" onClick={() => setIsEdit(true)}>
                수정
              </button> */}
              <button
                className="text-red-300"
                onClick={(e) => handleCommentDelete(e)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        {isEdit ? (
          <CommentForm
            setEdit={setIsEdit}
            value={comment.content}
            handleSubmit={handleCommentUpdateSubmit}
          />
        ) : (
          <div>
            <p>{comment.content}</p>
          </div>
        )}

        {!isReply && !isEdit && (
          <div className="flex justify-end">
            <button
              className="text-gray-500 text-sm"
              onClick={() => setAddReply(true)}
            >
              답글
            </button>
          </div>
        )}
      </div>
      {comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply, index) => (
          <div key={reply.id} className="flex bg-gray-100 border-t-[1px]">
            <div className="pl-4 py-5">
              <ArrowSVG className="scale-1000" />
            </div>
            <CommentCard
              postId={postId}
              comment={reply}
              isReply={true}
              isLast={isLast && comment.replies.length - 1 === index}
              fetchComments={fetchComments}
            />
          </div>
        ))}
      {addReply && (
        <div
          className={`flex bg-gray-100 ${
            isLast ? "border-y-[1px]" : "border-t-[1px]"
          }`}
        >
          <div className="pl-4 py-5">
            <ArrowSVG className="scale-1000" />
          </div>
          <div className="w-full m-3">
            <CommentForm
              setEdit={setAddReply}
              value=""
              handleSubmit={handleReplySubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
