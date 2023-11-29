import { useState, useEffect } from "react";
import SingleSelect from "../components/singleSelect";
import MultiSelect from "../components/multiSelect";
import Input from "../components/Input";
import axios, { AxiosError } from "axios";
import store from "../store";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor as DraftEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import arrToString from "../libs/arrToString";
import Item from "../components/item";
import { useNavigate } from "react-router";
const curriculumIdMap: { [key: string]: number } = {
  "풀스택 과정": 2,
  "정보 보안 전문가 양성 과정": 3,
  "쿠버네티스 과정": 4,
  "AI자연어처리 과정": 5,
};
const classificationIdMap: { [key: string]: string } = {
  스터디: "STUDY",
  프로젝트: "PROJECT",
};
const PostRegister = () => {
  const [formData, setFormData] = useState({
    classification: "", // Single-select
    subject: [], // Multi-select
    stack: [], // Multi-select
    recruitNum: "", // Input
    curriculumId: "", // Single-select
    contactUrl: "", // Input
    title: "", // Input
    content: "",
  });
  const userId = store.getState().user.userData?.accountId;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const handleInputChange = (value: any, name: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleRichInputChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const handleSingleSelectChange = (selectedValue: any, name: any) => {
    setFormData({
      ...formData,
      [name]: selectedValue,
    });
  };

  const handleMultiSelectChange = (selectedValues: any, name: any) => {
    setFormData({
      ...formData,
      [name]: selectedValues,
    });
  };
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
  const convertContentToHTML = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    const contentHtml: string = draftToHtml(contentRaw as any); // Type assertion
    return contentHtml;
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const htmlContent = convertContentToHTML();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const curriculumId = curriculumIdMap[formData.curriculumId];
    const classificationId = classificationIdMap[formData.classification];
    // 요청 본문 데이터
    const requestData = {
      classification: classificationId,
      subject: arrToString(formData.subject), //
      techStack: arrToString(formData.stack), //
      recruitNum: +formData.recruitNum,
      curriculumId: curriculumId,
      contactUrl: formData.contactUrl,
      title: formData.title,
      status: "RECRUITING",
      content: htmlContent,
      accountId: userId,
    };
    // Axios를 사용하여 POST 요청 보내기
    try {
      const response = await axios.post(
        process.env.REACT_APP_DB_HOST + "/api/posts",
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
        if (response.data.ok) {
          const postId = response.data.data.post.id;
          navigate(`/post/${postId}`);
        }
      }
    } catch (error) {
      console.error("POST 요청 실패", error);
    }
  };
  return (
    <div className="h-full flex justify-center">
      <div className="flex w-full  max-w-7xl ">
        <div className="flex flex-col space-y-5 w-full">
          <div className="flex mt-5 gap-5 px-5 w-full">
            <div className="flex-1">
              <span>모집 구분</span>
              <SingleSelect
                name="classification" // Make sure the name prop is "classification"
                selectedValue={formData.classification}
                onChange={(selected) =>
                  handleSingleSelectChange(selected, "classification")
                }
                options={[
                  { value: "0", label: "스터디" },
                  { value: "1", label: "프로젝트" },
                ]}
                placeholder="스터디/프로젝트"
              />
            </div>
            <div className="flex-1">
              <span>스터디 인원</span>

              <SingleSelect
                name="recruitNum" // Make sure the name prop is "recruitmentType"
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
                name="curriculumId" // Make sure the name prop is "recruitmentType"
                selectedValue={formData.curriculumId}
                onChange={(selected) =>
                  handleSingleSelectChange(selected, "curriculumId")
                }
                options={[
                  { value: "1", label: "풀스택 과정" },
                  { value: "2", label: "쿠버네티스 과정" },
                  { value: "3", label: "AI자연어처리 과정" },
                  {
                    value: "4",
                    label: "정보 보안 전문가 양성 과정",
                  },
                ]}
                placeholder="수강중인 과정"
              />
            </div>
            <div className="flex-1">
              <span>연락 방법</span>
              <Input
                placeholder="오픈 채팅방 혹은 email"
                selectedValue={formData.contactUrl}
                onChange={(selected) =>
                  handleInputChange(selected, "contactUrl")
                }
              />
            </div>
          </div>
          <div className="flex mt-5 gap-5 px-5 w-full">
            <div className="flex-1">
              <span>What We Do</span>
              <div className="py-3 flex flex-wrap  gap-3">
                {formData.subject.map((item) => (
                  <Item key={item} text={item} />
                ))}
              </div>
              <MultiSelect
                name="subject" // Make sure the name prop is "recruitmentType"
                selectedValues={formData.subject}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "subject")
                }
                options={[
                  { value: "CS", label: "CS-스터디" },
                  { value: "CODING_TEST", label: "코딩 테스트-스터디" },
                  { value: "INTERVIEW", label: "면접-스터디" },
                  { value: "FRONTEND", label: "프론트엔드-프로젝트" },
                  { value: "BACKEND", label: "백엔드-프로젝트" },
                  { value: "DEVOPS", label: "데브옵스-프로젝트" },
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
                name="stack" // Make sure the name prop is "recruitmentType"
                selectedValues={formData.stack}
                onChange={(selected) =>
                  handleMultiSelectChange(selected, "stack")
                }
                options={[
                  { value: "JAVA", label: "java" },
                  { value: "JAVASCRIPT", label: "javascript" },
                  { value: "TYPESCRIPT", label: "typescript" },
                  { value: "REACT", label: "react" },
                  { value: "REDUX", label: "redux" },
                  { value: "SPRING", label: "spring" },
                  { value: "AWS", label: "aws" },
                  { value: "KUBERNETES", label: "kubernetes" },
                  { value: "TENSORFLOW", label: "tensorflow" },
                ]}
                placeholder="기술 스택"
              />
            </div>
          </div>
          <div className="flex px-5 py-5 w-full">
            <div className="w-full flex flex-col gap-5">
              <span>프로젝트 제목 및 설명을 작성해주세요~</span>
              <Input
                placeholder="프로젝트 제목"
                selectedValue={formData.title}
                onChange={(selected) => handleInputChange(selected, "title")}
              />
              {/* <Input
                placeholder="프로젝트 설명"
                selectedValue={formData.content}
                onChange={(selected) => handleInputChange(selected, "content")}
              /> */}

              <div className="border bg-white p-3 rounded-md h-full min-h-[400px]  ">
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
                  onEditorStateChange={handleRichInputChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center pb-5">
            <button
              className="w-fit bg-my-blue rounded-md text-my-color p-2"
              onClick={() => handleSubmit()}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostRegister;
