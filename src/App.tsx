import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import PostRegister from "./pages/PostRegister";
import axios from "axios";
import NotFound from "./pages/NotFount";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/test")
      .then((response) => {
        const { data } = response;

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        if (!data || typeof data !== "object") {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        setMessage(data.SUCCESS_TEXT);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      });
  }, []);
  console.log(message);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="/PostRegister" element={<PostRegister />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
