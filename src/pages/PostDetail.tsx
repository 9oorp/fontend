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

const PostDetail = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();

  const [post, setPost] = useState<postDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = store.getState().userData;
  console.log(user.accountId, post?.accountId);

  const [selected, setSelected] = useState<string>(post ? post.status : "");
  console.log(selected);
  const options = [
    { value: "모집중", label: "모집중" },
    { value: "모집종료", label: "모집종료" },
  ];

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const response = await axios.put(`/api/posts/${postId}`, {
        status: newStatus,
      });
      console.log(response);
    } catch (error) {
      // Handle the error
      console.error("Error updating post status:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);

      setPost(response.data.data.post);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError && axiosError.response) {
        console.error("Error fetching data:", axiosError.response.data);
        setError(axiosError.response.data.message || "Error fetching data");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  console.log(post);
  useEffect(() => {
    fetchData();
    post?.status === "0" ? setSelected("모집중") : setSelected("모집종료");
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full max-w-7xl flex-col px-10">
        {post && (
          <>
            <div className="flex justify-between items-center py-5">
              <div className="w-2/3 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold text-2xl">
                {post.title}
              </div>
              {user.accountId === post?.accountId && (
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
              <div>모집일:{post.createdAt}</div>
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
                    {post.classification ? "프로젝트" : "스터디"}
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
                  </div>
                </div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="flex flex-col">
                    <div className="text-gray-400">기술 스택</div>
                    <div className="pl-4 pt-2 flex gap-2">
                      {post.stack.map((item, index) => (
                        <DynamicImage key={index} imageName={item} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">what we do</div>
                  <div className="pl-4 pt-2 flex flex-wrap  gap-2">
                    {post.subject.map((item, index) => (
                      <Item text={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {user.accountId === post?.accountId && (
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
