import { useState } from "react";
import store from "../store";
import logo from "../assets/logo.png";
import { ReactComponent as Hamburger } from "../assets/burger-menu.svg";
import { Link } from "react-router-dom";
import LoginModal from "./auth/loginModal";

// console.log(store.getState().isLoggedIn);
// store.getState().isLoggedIn;

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const showModal = () => {
    setModalOpen(true);
  };
  const handleOutsideClick = (event: any) => {
    // Check if the event's target matches the outer div itself
    if (event.target === event.currentTarget) {
      setModalOpen(false);
    }
  };
  return (
    <>
      <div className="h-12 bg-white flex justify-center items-center sticky w-screen left-0 top-0 z-[89] ">
        <div className="flex w-full justify-between items-center  max-w-7xl p-5 ">
          <div className="cursor-pointer">
            <Hamburger />
          </div>
          <Link to={"/"}>
            <img src={logo} alt="logo" />
          </Link>

          {store.getState().isLoggedIn ? (
            <div>글작성</div>
          ) : (
            <span className="cursor-pointer" onClick={() => showModal()}>
              로그인
            </span>
          )}
        </div>
      </div>
      {modalOpen && (
        <div
          onClick={handleOutsideClick}
          className="w-full h-full backdrop-blur-sm bg-black bg-opacity-20 top-0 bottmom-14 fixed flex justify-center items-center z-[90]"
        >
          <LoginModal setModalOpen={setModalOpen} />
        </div>
      )}
    </>
  );
};
export default Header;
