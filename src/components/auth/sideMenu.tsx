import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/modules/user";
import { setCurriculumId } from "../../store/modules/curriculum";
import { useEffect, useRef, useState } from "react";
import store from "../../store";
import DynamicImage from "../dynamicImage";
import axios from "axios";
import { useNavigate } from "react-router";
import { ReactComponent as BoxArrowRightSVG } from "../../assets/box-arrow-right.svg";

const SideMenu = ({ setMenuOpen }: any) => {
  const dispatch = useDispatch();
  const user = store.getState().user.userData.memberName;
  const [post, setPost] = useState<{ title: string; id: string }[]>([]);
  const navigate = useNavigate();

  const handlecurriculumIdChange = (selectedCurriculumId: number) => {
    dispatch(setCurriculumId(selectedCurriculumId));
    setMenuOpen(false);
  };
  const handleChange = (e: any) => {
    dispatch(logoutAction());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
    setMenuOpen(false);
  };
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Function to close the menu when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpen]);
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
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      try {
        const apiUrl =
          process.env.REACT_APP_DB_HOST +
          `/api/members/${store.getState().user.userData.accountId}/posts`;

        const response = await axios.get(apiUrl, { headers });

        response.data.data.Posts && setPost(response.data.data.Posts);

        if (response.data.errorMessage === "토큰 만료") {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            const headers = {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            };

            const apiUrl =
              process.env.REACT_APP_DB_HOST +
              `/api/members/${store.getState().user.userData.accountId}/posts`;

            const response = await axios.get(apiUrl, { headers });

            response.data.data.Posts && setPost(response.data.data.Posts);
          }
        }

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className=" bg-white w-60 min-h-fit shadow-md rounded-lg fixed z-50 left-8 top-15 p-4"
      ref={menuRef}
    >
      <div>
        {store.getState().user.isLoggedIn ? (
          <div className="flex gap-2 py-2 items-center cursor-pointer ">
            <div className="rounded-md bg-blue-500 px-2 py-1 text-white">
              {user[0]}
            </div>
            <div className="truncate">{user}</div>
          </div>
        ) : (
          <div>비로그인</div>
        )}
        <hr className="pt-1" />
        <div
          className="flex py-2 gap-2 cursor-pointer"
          onClick={() => {
            handlecurriculumIdChange(2);
            navigate("/");
          }}
        >
          <DynamicImage imageName={"FullStack"} />
          <p>풀스택 과정</p>
        </div>
        <div
          className="flex py-2 gap-2 cursor-pointer"
          onClick={() => {
            handlecurriculumIdChange(3);
            navigate("/");
          }}
        >
          <DynamicImage imageName={"InfoSec"} />
          <p>정보 보안 과정</p>
        </div>
        <div
          className="flex py-2 gap-2 cursor-pointer"
          onClick={() => {
            handlecurriculumIdChange(4);
            navigate("/");
          }}
        >
          <DynamicImage imageName={"kuber"} />
          <p>쿠버네티스 과정</p>
        </div>
        <div
          className="flex py-2 gap-2 cursor-pointer"
          onClick={() => {
            handlecurriculumIdChange(5);
            navigate("/");
          }}
        >
          <DynamicImage imageName={"NLP"} />
          <p>AI자연어처리 과정</p>
        </div>
        <hr className="pt-1" />
        <div>
          {post ? (
            post.map((post) => (
              <div
                key={post.id}
                className="flex gap-2 py-2 items-center cursor-pointer "
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="rounded-md bg-blue-500 w-7 h-7 text-center text-white">
                  {post.title[0]}
                </div>
                <div className="truncate">{post.title}</div>
              </div>
            ))
          ) : (
            <div className="truncate">프로젝트가 없습니다.</div>
          )}
        </div>
        <hr className="pt-1" />
      </div>

      <div
        className="cursor-pointer flex gap-2 items-center"
        onClick={handleChange}
      >
        <BoxArrowRightSVG />
        로그아웃
      </div>
    </div>
  );
};
export default SideMenu;
