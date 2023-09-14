import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/modules/user";

const SideMenu = ({ setMenuOpen }: any) => {
  const dispatch = useDispatch();
  const handleChange = (e: any) => {
    dispatch(logoutAction());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
    setMenuOpen(false);
  };
  return (
    <div className="bg-my-color w-40">
      <div onClick={handleChange}>logout</div>
    </div>
  );
};
export default SideMenu;
