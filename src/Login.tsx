import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

function Login() {
  const [visibility, setVisibility] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login | Chat App";
  }, []);

  const handleClose = () => {
    setVisibility({
      open: false,
      message: "",
    });
  };

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const loginButtonOnClick = async () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    await axios
      .post("/user/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        navigate("/chat", {
          state: {
            username: res.data["data"]["username"],
          },
        });
      })
      .catch((e) => {
        setVisibility({
          open: true,
          message:
            "User Not Exist or Username/Password Combination is Incorrect",
        });
      });
  };

  const registerTextOnClick = () => {
    navigate("/register");
  };

  return (
    <div className="App select-none">
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        autoHideDuration={2000}
        open={visibility.open}
        onClose={handleClose}
        message={visibility.message}
      />
      <header className="App-header">
        <h1 className="font-bold text-5xl mb-4">Chat App</h1>
        <input
          ref={usernameRef}
          autoComplete="off"
          className="rounded text-gray-800 p-2"
          type="text"
          placeholder="Enter username"
        />
        <div className="h-4"></div>
        <input
          ref={passwordRef}
          autoComplete="off"
          className="rounded text-gray-800 p-2 mb-2"
          type="password"
          placeholder="Enter password"
        />
        <div className="h-2"></div>
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 w-40 border border-gray-400 rounded shadow"
          onClick={loginButtonOnClick}
        >
          Login
        </button>
        <div className="h-2"></div>
        <p>
          Didn't have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={registerTextOnClick}
          >
            Register
          </span>
        </p>
      </header>
    </div>
  );
}

export default Login;
