import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import PostRegister from "./pages/PostRegister";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((json) => setMessage(json.SUCCESS_TEXT));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="/PostRegister" element={<PostRegister />} />
      </Route>
    </Routes>
  );
}

export default App;
