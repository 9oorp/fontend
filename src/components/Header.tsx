import { useState } from "react";
import store from "../store";
import logo from "../assets/logo.png";
import { ReactComponent as Hamburger } from "../assets/burger-menu.svg";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./auth/authModal";
import SideMenu from "./auth/sideMenu";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setModalOpen(true);
  };
  const handleOutsideClick = (event: any) => {
    if (event.target === event.currentTarget) {
      setModalOpen(false);
    }
  };
  const handleClick = () => {
    window.location.reload();
    navigate("/");
  };
  return (
    <>
      <div className="h-12 bg-white flex justify-center items-center sticky w-screen left-0 top-0 z-[89] ">
        <div className="flex w-full justify-between items-center  max-w-7xl p-5 ">
          <div
            className="cursor-pointer"
            onMouseOver={() => setMenuOpen(true)}
            // onMouseOut={() => setMenuOpen(false)}
          >
            <Hamburger />
          </div>
          <Link to={"/"} onClick={() => handleClick}>
            <img src={logo} alt="logo" />
          </Link>

          {store.getState().user.isLoggedIn ? (
            <div
              className="cursor-pointer"
              onClick={() => navigate("/PostRegister")}
            >
              글작성
            </div>
          ) : (
            <span className="cursor-pointer" onClick={() => showModal()}>
              로그인
            </span>
          )}
        </div>
      </div>
      {modalOpen && (
        <div
          onMouseDown={handleOutsideClick}
          className="w-full h-full backdrop-blur-sm bg-black bg-opacity-20 top-0 bottmom-14 fixed flex justify-center items-center z-[90]"
        >
          <AuthModal setModalOpen={setModalOpen} />
        </div>
      )}
      {menuOpen && <SideMenu setMenuOpen={setMenuOpen} />}
    </>
  );
};
export default Header;
