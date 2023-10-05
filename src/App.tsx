import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import PostRegister from "./pages/PostRegister";
import NotFound from "./pages/NotFount";
import PostDetail from "./pages/PostDetail";
import PostEdit from "./pages/PostEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="/PostRegister" element={<PostRegister />} />
        <Route path="/Post/:id" element={<PostDetail />} />
        <Route path="/PostEdit/:id" element={<PostEdit />} />

        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
