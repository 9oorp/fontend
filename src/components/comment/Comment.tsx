import React, { useEffect, useRef, useState } from "react";
import CommentCard from "./CommentCard";
import axios from "axios";
import requests from "../../api/requests";
import { commentCreateRequest, commentResponse } from "../../types/commentType";
import store from "../../store";
import CommentInput from "./CommentInput";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../../api/manageToken";

interface Props {
  postId: number;
}

export default function Comment({ postId }: Props) {
  const navigate = useNavigate();
  const user = store.getState().user.userData;

  const [comments, setComments] = useState<commentResponse[]>([]);
  const [comment, setComment] = useState("");

  const totalComments = comments.reduce((total, comm) => {
    // 코멘트 수와 각 코멘트의 replies 길이를 합산하여 총 댓글 수를 구합니다.
    return total + 1 + comm.replies.length;
  }, 0);
  const requestData: commentCreateRequest = {
    content: comment,
    parentCommentId: null,
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        // process.env.REACT_APP_DB_HOST +
        `${requests.fetchPost}/${postId}/comments`
      );

      setComments(response.data.data.comments);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
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

      await fetchComments();
    } catch (error) {
      // console.error("POST 요청 실패", error);
    }

    setComment("");
  };

  return (
    <div className="flex flex-col justify-between items-center py-5">
      <hr className="w-full m-2" />
      <div className="flex flex-col w-full p-5 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <p className="font-semibold text-lg">댓글</p>
          <p className="text-base text-sky-500">{totalComments}</p>
        </div>
        {user?.accountId === undefined ? (
          <form className="w-full">
            <CommentInput
              isEditable={false}
              value={comment}
              onChange={setComment}
            />
          </form>
        ) : (
          <form onSubmit={handleCommentSubmit} className="w-full">
            <CommentInput
              isEditable={true}
              value={comment}
              onChange={setComment}
            />
            <button
              type="submit"
              className="float-right bg-sky-500 text-sm px-2 py-2 rounded-md text-white"
            >
              등록하기
            </button>
          </form>
        )}
        <div className="my-3">
          {comments.length === 0 ? (
            <div className="flex justify-center text-gray-400">
              등록된 댓글이 없습니다.
            </div>
          ) : (
            <div>
              {comments.map((comment, index) => (
                <CommentCard
                  key={index}
                  postId={postId}
                  comment={comment}
                  isReply={false}
                  isLast={comments.length - 1 === index}
                  fetchComments={fetchComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
