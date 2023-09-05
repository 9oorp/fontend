import Header from "./Header";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className="bg-my-color w-screen">
      <Header />
      <Outlet />
    </div>
  );
};
export default Layout;
