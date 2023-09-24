import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router";
import { ErrorResponse, postDetail } from "../types";
import store from "../store";
import SingleSelect from "../components/singleSelect";

const PostDetail = () => {
  const { id } = useParams<string>();

  const [post, setPost] = useState<postDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = store.getState().userData;
  const [selected, setSelected] = useState<string>("");
  console.log(post?.status);
  const options = [
    { value: "모집중", label: "모집중" },
    { value: "모집마감", label: "모집마감" },
  ];

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
    post?.status === "모집중" ? setSelected("모집중") : setSelected("모집종료");
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(post?.memberName, user.memberName);
  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full max-w-7xl flex-col px-10">
        {post && (
          <>
            <div className="flex justify-between items-center py-5">
              <div className="w-2/3 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold text-2xl">
                {post.title}1111111111111111111
                111111111111111111111111111111111111111111111111111111111111111111
              </div>
              {user.memberName === post?.memberName && (
                <SingleSelect
                  name="heelo"
                  options={options}
                  selectedValue={selected}
                  placeholder={selected}
                  onChange={setSelected}
                />
              )}
              <div>모집일:{post.createdAt}</div>
            </div>
            <div className="bg-white flex flex-col rounded-lg border border-gray-300 shadow-lg gap-5 p-5">
              <div className="flex flex-col">
                <div className="text-gray-400">모집 내용</div>
                <div className="pl-4"> {post.content}</div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">모집 구분</div>
                  <div className="pl-4"> {post.classification}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">연락 방법</div>
                  <div className="pl-4"> {post.contactUrl}</div>
                </div>
              </div>
              <div className="flex flex-row ">
                <div className="flex flex-col w-1/2 ">
                  <div className="text-gray-400">모집 인원</div>
                  <div className="pl-4"> {post.recruitNum}명</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400">what we do</div>
                  <div className="pl-4"> {post.subject}</div>
                </div>
              </div>
              <div>
                <div className="text-gray-400">기술 스택</div>
                <div className="pl-4"> {post.stack}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
