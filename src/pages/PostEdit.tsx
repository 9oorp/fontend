import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import { Editor as DraftEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import arrToString from "../libs/arrToString";
import Input from "../components/Input";
import SingleSelect from "../components/singleSelect";
import MultiSelect from "../components/multiSelect";
import Item from "../components/item";
import store from "../store";

const curriculumIdMap: { [key: string]: number } = {
  "풀스택 과정": 2,
  "정보 보안 전문가 양성 과정": 3,
  "쿠버네티스 과정": 4,
  "AI자연어처리 과정": 5,
};
const classificationIdMap: { [key: string]: number } = {
  프로젝트: 0,
  스터디: 1,
};
const PostEdit = () => {
  const postId = useParams().id; // 포스트 ID를 React Router로부터 받아옵니다.
  const navigate = useNavigate();
  const userId = store.getState().user.userData.accountId;
  // axios.interceptors.request.use((request) => {
  //   console.log("HTTP Request:", request);
  //   return request;
  // });

  // // Axios response interceptor to log responses
  // axios.interceptors.response.use(
  //   (response) => {
  //     console.log("HTTP Response:", response);
  //     return response;
  //   },
  //   (error) => {
  //     console.error("HTTP Error Response:", error);
  //     throw error;
  //   }
  // );
  const [formData, setFormData] = useState({
    classification: "", // Single-select
    subject: [], // Multi-select
    stack: [], // Multi-select
    recruitNum: "", // Input
    curriculumName: "", // Single-select
    contactUrl: "", // Input
    title: "", // Input
    content: "",
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleInputChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSingleSelectChange = (selectedValue: string, name: string) => {
    setFormData({
      ...formData,
      [name]: selectedValue,
    });
  };

  const handleMultiSelectChange = (selectedValues: string[], name: string) => {
    setFormData({
      ...formData,
      [name]: selectedValues,
    });
  };
  const curriculumOptions = [
    // 커리큘럼 선택 항목 배열
    { value: "2", label: "풀스택 과정" },
    { value: "3", label: "쿠버네티스 과정" },
    { value: "4", label: "AI자연어처리 과정" },
    { value: "5", label: "정보 보안 전문가 양성 과정" },
  ];
  const convertContentToHTML = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    const contentHtml = draftToHtml(contentRaw); // Type assertion
    return contentHtml;
  };
  useEffect(() => {
    // postId를 사용하여 포스트의 현재 내용을 불러옵니다.
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_DB_HOST + `/api/posts/${postId}`
        );
        const postData = response.data.data.post; // 포스트의 현재 내용을 가져옵니다.
        // 포스트 데이터를 폼 데이터에 설정합니다.
        setFormData({
          classification: postData.classification ? "프로젝트" : "스터디",
          subject: postData.subject, // 데이터가 쉼표로 구분된 문자열이라면 적절히 파싱합니다.
          stack: postData.stack, // 데이터가 쉼표로 구분된 문자열이라면 적절히 파싱합니다.
          recruitNum: postData.recruitNum,
          curriculumName: postData.curriculumName,
          contactUrl: postData.contactUrl,
          title: postData.title,
          content: postData.content,
        });

        if (postData.content) {
          const blocksFromHTML = convertFromHTML(postData.content);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState);
        }
      } catch (error) {
        // console.error("포스트 데이터를 불러오는 중 에러 발생", error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const htmlContent = convertContentToHTML();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const classificationId = classificationIdMap[formData.classification];
    const curriculumId = curriculumIdMap[formData.curriculumName];
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
    // 요청 본문 데이터
    const requestData = {
      classification: classificationId,
      subject: arrToString(formData.subject),
      stack: arrToString(formData.stack),
      recruitNum: +formData.recruitNum,
      curriculumId: curriculumId,
      contactUrl: formData.contactUrl,
      title: formData.title,
      content: htmlContent,
      accountId: userId,
      status: "0",
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_DB_HOST + `/api/posts/${postId}`,
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
      } else {
        // 포스트 수정 성공 시 리다이렉션합니다.
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      // console.error("포스트 수정 요청 실패", error);
    }
  };
  return (
    <div className="h-full flex justify-center">
      <div className="flex w-full max-w-7xl">
        <div className="flex flex-col space-y-5 w-full">
          {/* 폼 컨트롤들을 여기에 추가 */}
          <div className="flex mt-5 gap-5 px-5 w-full">
            <div className="flex-1">
              <span>모집 구분</span>
              <SingleSelect
                name="classification"
                selectedValue={formData.classification}
                onChange={(selected) =>
                  handleSingleSelectChange(selected, "classification")
                }
                options={[
                  { value: "스터디", label: "스터디" },
                  { value: "프로젝트", label: "프로젝트" },
                ]}
                placeholder="스터디/프로젝트"
              />
            </div>
            <div className="flex-1">
              <span>스터디 인원</span>
              <SingleSelect
                name="recruitNum"
                selectedValue={formData.recruitNum}
                onChange={(selected) =>
                  handleSingleSelectChange(selected, "recruitNum")
                }
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                ]}
                placeholder="모집 인원"
              />
            </div>
          </div>
          <div className="flex mt-5 gap-5 px-5 w-full">
            <div className="flex-1">
              <span>커리큘럼</span>
              <SingleSelect
                name="curriculumName"
                selectedValue={formData.curriculumName}
                onChange={(selected) =>
                  handleSingleSelectChange(selected, "curriculumName")
                }
                options={curriculumOptions} // 커리큘럼 선택 항목을 사용합니다.
                placeholder="수강중인 과정"
              />
            </div>
            <div className="flex-1">
              <span>연락 방법</span>
              <Input
                placeholder="오픈 채팅방 혹은 email"
                selectedValue={formData.contactUrl} // formData.contactUrl을 전달
                onChange={(selected) =>
                  handleInputChange(selected, "contactUrl")
                }
              />
            </div>
          </div>
          <div className="flex mt-5 gap-5 px-5 w-full">
            <div className="flex-1">
              <span>What We Do</span>
              <div className="py-3 flex flex-wrap gap-3">
                {formData.subject.map((item) => (
                  <Item key={item} text={item} />
                ))}
              </div>
              <MultiSelect
                name="subject"
                selectedValues={formData.subject}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "subject")
                }
                options={[
                  { value: "CS", label: "CS-스터디" },
                  { value: "코딩 테스트", label: "코딩 테스트-스터디" },
                  { value: "면접", label: "면접-스터디" },
                  { value: "프론트엔드", label: "프론트엔드-프로젝트" },
                  { value: "백엔드", label: "백엔드-프로젝트" },
                  { value: "데브옵스", label: "데브옵스-프로젝트" },
                  { value: "AI", label: "AI-프로젝트" },
                ]}
                placeholder="뭘 할지 선택해주세요"
              />
            </div>
            <div className="flex-1">
              <span>기술 스택</span>
              <div className="py-3 flex flex-wrap gap-3">
                {formData.stack.map((item) => (
                  <Item key={item} text={item} />
                ))}
              </div>
              <MultiSelect
                name="stack"
                selectedValues={formData.stack}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "stack")
                }
                options={[
                  { value: "Java", label: "Java" },
                  { value: "Javascript", label: "Javascript" },
                  { value: "Typescript", label: "Typescript" },
                  { value: "React", label: "React" },
                  { value: "Redux", label: "Redux" },
                  { value: "Spring", label: "Spring" },
                  { value: "AWS", label: "AWS" },
                  { value: "쿠버네티스", label: "쿠버네티스" },
                  { value: "Kubernetes", label: "Kubernetes" },
                  { value: "Tensorflow", label: "Tensorflow" },
                ]}
                placeholder="기술 스택"
              />
            </div>
          </div>

          <div className="flex px-5 py-5 w-full">
            <div className="w-full flex flex-col gap-5">
              <span>프로젝트 제목 및 설명을 수정하세요~</span>
              <Input
                placeholder="프로젝트 제목"
                selectedValue={formData.title}
                onChange={(selected) => handleInputChange(selected, "title")}
              />

              <div className="border bg-white p-3 rounded-md h-full min-h-[400px]">
                <DraftEditor
                  editorState={editorState}
                  wrapperStyle={{
                    height: "100%",
                  }}
                  editorStyle={{
                    height: "88%",
                    overflowY: "hidden",
                    cursor: "text",
                    paddingLeft: "10px",
                  }}
                  onEditorStateChange={setEditorState}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center pb-5">
            <button
              className="w-fit bg-my-blue rounded-md text-my-color p-2"
              onClick={() => handleSubmit()}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
