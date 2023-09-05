import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
const LoginModal = ({ setModalOpen }: any) => {
  const [values, setValues] = useState({
    id: "",
    password: "",
  });
  const handleChange = (e: any) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setModalOpen(false);
    alert(JSON.stringify(values, null, 2));
  };
  return (
    <div className=" w-80 block rounded-md bg-my-color p-5 shadow-md">
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

        <div className="flex flex-col space-y-2 w-full">
          <input
            className="p-2 outline-none h-11 border-2 text-base border-my-border rounded-md focus:border-transparent focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            type="id"
            name="id"
            value={values.id}
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
        </div>
        <div className="w-full flex flex-col space-y-2">
          <input
            type="submit"
            value={"로그인"}
            className="w-full  cursor-pointer bg-my-blue text-white rounded-md p-3 hover:bg-blue-500"
          />

          <div className="text-right">
            <Link className=" hover:text-my-lblue hover:underline" to={"/"}>
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
export default LoginModal;
