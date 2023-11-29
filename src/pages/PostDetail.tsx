import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router";
import { ErrorResponse, postDetail } from "../types";
import store from "../store";
import SingleSelect from "../components/singleSelect";
import Item from "../components/item";
import DynamicImage from "../components/dynamicImage";
import { ReactComponent as BoxSVG } from "../assets/box-arrow-up-right.svg";
import { cls } from "../libs/utils";
import arrToString from "../libs/arrToString";
import Comment from "../components/comment/Comment";

const PostDetail = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  // const classificationIdMap: { [key: string]: number } = {
  //   프로젝트: 0,
  //   스터디: 1,
  // };
  const curriculumIdMap: { [key: string]: number } = {
    "풀스택 과정": 2,
    "정보 보안 전문가 양성 과정": 3,
    "쿠버네티스 과정": 4,
    "AI자연어처리 과정": 5,
  };
  const [post, setPost] = useState<postDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = store.getState().user.userData;

  const [selected, setSelected] = useState<string>(post ? post.status : "");

  const options = [
    { value: "모집중", label: "모집중" },
    { value: "모집종료", label: "모집종료" },
  ];

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      // Get the access token from your preferred location
      const accessToken = localStorage.getItem("accessToken"); // You can adjust this based on where you store your token

      // Make sure you have the access token
      if (!accessToken) {
        // console.error("Access token not found.");
        return;
      }
      const refreshAccessToken = async (refreshToken: any) => {
        const headers = {
          Authorization: `Bearer ${refreshToken}`,
        };
        try {
          const response = await axios.post(
            process.env.REACT_APP_DB_HOST + "/api/auth/refresh-token",
            null,
            {
              headers,
            }
          );
          // 새로운 access token을 얻었을 때의 처리
          if (response.data.ok) {
            // 서버 응답 확인
            const newAccessToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            // 여기에서 accessToken 경로를 확인하고 값을 얻어올 수 있도록 코드를 수정
          } else {
            // console.error("토큰 갱신 실패: 응답 상태 코드", response.status);
          }
        } catch (error) {
          // console.error("토큰 갱신 실패", error);
        }
      };
      const curriculumId = curriculumIdMap[post?.curriculumName || ""];
      const requestData = {
        classification: post?.classification,
        subject: arrToString(post?.subject || []), // Make sure to handle possible null or undefined values
        techStack: arrToString(post?.stack || []), // Make sure to handle possible null or undefined values
        recruitNum: post?.recruitNum || 0, // Make sure to handle possible null or undefined values
        curriculumId: curriculumId, // Make sure to define curriculumId
        contactUrl: post?.contactUrl || "",
        title: post?.title || "",
        content: post?.content || "",
        accountId: post?.accountId || "",
        status: newStatus,
      };
      // Include the access token in the headers
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Send the PUT request with the headers
      const response = await axios.put(
        process.env.REACT_APP_DB_HOST + `/api/posts/${id}`,
        requestData,
        {
          headers,
        }
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
            process.env.REACT_APP_DB_HOST + "/api/posts",
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
    } catch (error) {
      // Handle the error
      // console.error("Error updating post status:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DB_HOST + `/api/posts/${id}`
      );

      setPost(response.data.data.post);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError && axiosError.response) {
        // console.error("Error fetching data:", axiosError.response.data);
        setError(axiosError.response.data.message || "Error fetching data");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  useEffect(() => {
    fetchData();
    post?.status === "0" ? setSelected("모집중") : setSelected("모집종료");
  }, [id, post?.status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="h-full pb-5 flex justify-center">
      <div className="flex w-full max-w-7xl flex-col px-10">
        {post && (
          <>
            <div className="flex justify-between items-center py-5">
              <div className="w-2/3 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold text-2xl">
                {post.title}
              </div>
              {user?.accountId === post?.accountId && (
                <SingleSelect
                  name="heelo"
                  options={options}
                  selectedValue={selected}
                  placeholder={selected}
                  onChange={(newStatus) => {
                    setSelected(newStatus);
                    updatePostStatus(id!, newStatus);
                  }}
                />
              )}
              <div>모집일:{post.createdAt.substring(0, 10)}</div>
            </div>
            <div className="bg-white flex flex-col rounded-lg border border-gray-300 shadow-lg gap-3 p-5">
              <div className="flex flex-col">
                <div className="text-gray-400">모집 내용</div>
                <div
                  className="pl-4 pt-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">모집 구분</div>
                  <div className="pl-4 pt-2">
                    {post.classification === "1" ? "프로젝트" : "스터디"}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">커리큘럼</div>
                  <div className="pl-4 pt-2"> {post.curriculumName}</div>
                </div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">모집 인원</div>
                  <div className="pl-4 pt-2 "> {post.recruitNum}명</div>
                </div>
                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">연락 방법</div>
                  <div className="pl-4 pt-2 whitespace-nowrap overflow-hidden text-ellipsis ">
                    {post.contactUrl.includes("http") ? (
                      <a
                        href={post.contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BoxSVG
                          className={cls(
                            "w-5 aspect-square transition-all cursor-pointer"
                          )}
                        />
                      </a>
                    ) : (
                      <div className="pl-4 pt-2 "> {post.contactUrl}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="flex flex-col">
                    <div className="text-gray-400">기술 스택</div>
                    <div className="pl-4 pt-2 flex gap-2">
                      {post.stack.map((item: string, index) => (
                        <DynamicImage
                          key={index}
                          imageName={item.toLowerCase()}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">what we do</div>
                  <div className="pl-4 pt-2 flex flex-wrap  gap-2">
                    {post.subject.map((item, index) => (
                      <Item key={index} text={item} />
                    ))}
                  </div>
                </div>
              </div>
              {id && <Comment postId={parseInt(id)} />}
            </div>
            {user?.accountId === post?.accountId && (
              <div className="flex justify-center items-center py-5">
                <button
                  className="w-fit bg-my-blue rounded-md text-my-color p-2"
                  onClick={() => navigate(`/PostEdit/${post.id}`)}
                >
                  수정하기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
