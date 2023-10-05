import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/modules/user";
import { setCurriculumId } from "../../store/modules/curriculum";

const SideMenu = ({ setMenuOpen }: any) => {
  const dispatch = useDispatch();

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
  return (
    <div className="bg-white w-52 h-3/4 min-h-fit shadow-md rounded-lg fixed z-50 left-8 top-15 p-4 ">
      <div>
        <div
          className="cursor-pointer flex justify-end"
          onClick={() => setMenuOpen(false)}
        >
          x
        </div>
        <p>Curriculum 선택:</p> <hr />
        <button onClick={() => handlecurriculumIdChange(2)}>풀스택 과정</button>
        <hr />
        <button onClick={() => handlecurriculumIdChange(3)}>
          정보 보안 과정
        </button>
        <hr />
        <button onClick={() => handlecurriculumIdChange(4)}>
          쿠버네티스 과정
        </button>
        <hr />
        <button onClick={() => handlecurriculumIdChange(5)}>
          AI자연어처리 과정
        </button>
        <hr />
      </div>
      <div className="cursor-pointer" onClick={handleChange}>
        logout
      </div>
    </div>
  );
};
export default SideMenu;
