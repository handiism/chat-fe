import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | Chat App";
  }, []);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordAgainRef = useRef<HTMLInputElement>(null);

  const registerButtonOnClick = () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordAgain = passwordAgainRef.current?.value;

    if (password === passwordAgain) {
      axios
        .post("/user/register", {
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
          console.log(e);
        });
    }
  };
  const loginTextOnClick = () => {
    navigate("/login");
  };

  return (
    <div className="App select-none">
      <header className="App-header">
        <h1 className="font-bold text-5xl mb-4">Chat App</h1>
        <input
          ref={usernameRef}
          className="rounded text-gray-800 p-2"
          type="text"
          placeholder="Enter username"
        />
        <div className="h-4"></div>
        <input
          ref={passwordRef}
          className="rounded text-gray-800 p-2"
          type="password"
          placeholder="Enter password"
        />
        <div className="h-4"></div>
        <input
          ref={passwordAgainRef}
          className="rounded text-gray-800 p-2 mb-2"
          type="password"
          placeholder="Enter password again"
        />
        <div className="h-2"></div>
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-1 w-40 border border-gray-400 rounded shadow"
          onClick={registerButtonOnClick}
        >
          Register
        </button>
        <div className="h-2"></div>
        <p>
          Have an account?{" "}
          <span className="underline cursor-pointer" onClick={loginTextOnClick}>
            Login
          </span>
        </p>
      </header>
    </div>
  );
}

export default Register;
