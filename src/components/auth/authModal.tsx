import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";

import axios, { AxiosError } from "axios";
const AuthModal = ({ setModalOpen }: any) => {
  const [toggle, setToggle] = useState(true);
  const [error, setError] = useState("");
  const toggleHandler = () => {
    setToggle(!toggle);
    setError("");
  };

  const [values, setValues] = useState({
    accountId: "",
    password: "",
    passwordCheck: "",
    name: "",
  });
  const handleChange = (e: any) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (toggle) {
      try {
        const response = await axios.post(
          // process.env.REACT_APP_DB_HOST +
          "/api/members/login",
          {
            accountId: values.accountId,
            password: values.password,
          }
        );

        if (response.data.ok) {
          const accessToken = response.data.data.accessToken;
          const refreshToken = response.data.data.refreshToken;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setModalOpen(false);
          window.location.reload();
        } else {
          setError(response.data.errorMessage);
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const errorMessage =
            (axiosError.response.data as { message: string }).message ||
            "로그인 실패";
          alert(errorMessage);
        } else if (axiosError.request) {
          alert("서버 응답 없음");
        } else {
          alert("로그인 요청 중 오류 발생");
        }
      }
    } else {
      // 회원가입
      try {
        const response = await axios.post(
          // process.env.REACT_APP_DB_HOST +
          "/api/members/join",
          {
            accountId: values.accountId,
            password: values.password,
            passwordConfirm: values.passwordCheck,
            memberName: values.name,
          }
        );
        if (response.data.ok) {
          setToggle(true);
          setError("");
        } else {
          setError(response.data.errorMessage);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const errorMessage =
            (axiosError.response.data as { message: string }).message ||
            "회원가입 실패";
          setError(errorMessage);
        } else if (axiosError.request) {
          setError("서버 응답 없음");
        } else {
          setError("회원가입 요청 중 오류 발생");
        }
      }
    }
  };

  return (
    <div className="w-96 block rounded-md bg-my-color p-5 shadow-md">
      <form
        className="flex flex-col items-center justify-center space-y-5 text-xs"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center justify-center">
          <Link to={"/"}>
            <img src={logo} alt="logo" />
          </Link>

          <span>하나의 아이디로 구릅 서비스를 이용하세요</span>
        </div>

        <div>
          <span>다른 서비스로 로그인</span>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full border-b-2" />
          <span className="relative bottom-2 px-4 bg-my-color">또는</span>
        </div>
        {toggle ? (
          <>
            <div className="flex flex-col space-y-2 w-full">
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="text"
                name="accountId"
                value={values.accountId}
                onChange={handleChange}
                placeholder="아이디"
              />
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="비밀번호"
              />
              <span className="text-red-600">{error}</span>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <input
                type="submit"
                value={"로그인"}
                className="w-full  cursor-pointer bg-my-blue text-white rounded-md p-3 hover:bg-blue-500"
              />

              <div className="text-right">
                <span
                  className=" hover:text-my-lblue hover:underline cursor-pointer"
                  onClick={toggleHandler}
                >
                  회원가입
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-2 w-full">
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="text"
                name="accountId"
                value={values.accountId}
                onChange={handleChange}
                placeholder="아이디(5글자 이상)"
              />
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="비밀번호(10글자 이상 영어,숫자 포함)"
              />
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="password"
                name="passwordCheck"
                value={values.passwordCheck}
                onChange={handleChange}
                placeholder="비밀번호 확인"
              />
              <input
                className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                type="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="홍길동(풀스택 4회차)"
              />
            </div>
            <span className="text-red-600">{error}</span>
            <div className="w-full flex flex-col space-y-2">
              <input
                type="submit"
                value={"회원가입"}
                className="w-full  cursor-pointer bg-my-blue text-white rounded-md p-3 hover:bg-blue-500"
              />

              <div className="text-center">
                <span>이미 계정이 있으세요? </span>
                <span
                  className=" text-my-lblue hover:underline cursor-pointer"
                  onClick={toggleHandler}
                >
                  로그인
                </span>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
export default AuthModal;
