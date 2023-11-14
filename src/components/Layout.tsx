import Header from "./Header";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div className="bg-my-color min-h-screen overflow-x-hidden">
      <Header />
      <Outlet />
    </div>
  );
};
export default Layout;
