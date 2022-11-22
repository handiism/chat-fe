import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Chat.css";
import { decrypt, encrypt } from "./Crypto";
import Message from "./Message";

const baseURL = process.env.REACT_APP_WEBSOCKET_BASE_URL;
const ws = new WebSocket(`${baseURL}/chat`);

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      action: "unsubscribe",
      topic: "crypto",
    })
  );

  ws.send(
    JSON.stringify({
      action: "subscribe",
      topic: "crypto",
    })
  );
};

function Chat() {
  const { state } = useLocation();
  const { username } = state;
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message>({
    position: "right",
    text: "",
  });

  ws.onmessage = (e) => {
    const m: Message = {
      position: "left",
      text: e.data,
    };

    setMessages([...messages, m]);
  };

  useEffect(() => {
    document.title = "Chat App";

    const formHeight = document.querySelector(".form")?.clientHeight;
    (container.current as HTMLDivElement).style.height =
      "calc(100vh - " + formHeight + "px)";
  }, []);

  const fileOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    (document.getElementById("input-text") as HTMLInputElement).value = "";

    const file = fileRef.current?.files;
    const fileReader = new FileReader();
    let fileDataURL: string = "";

    if (file && file.length !== 0) {
      fileReader.readAsDataURL(file[0]);
      fileReader.onload = () => {
        fileDataURL = String(fileReader.result);
        const dataURL = String(fileDataURL);
        setMessage({
          position: "right",
          text: encrypt(dataURL),
        });
      };
    }
  };

  const textOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    (document.getElementById("input-file") as HTMLInputElement).value = "";

    const ref = messageRef.current;
    setMessage({
      position: "right",
      text: encrypt(String(ref?.value)),
    });
  };

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = String(messageRef.current?.value);
    const files = fileRef.current?.files;

    if (!text && files && files.length === 0) {
      return;
    }

    ws.send(
      JSON.stringify({
        action: "publish",
        topic: "crypto",
        message: message.text,
      })
    );

    const messageExist = messageRef.current;
    const fileExist = fileRef.current;
    if (messageExist && fileExist) {
      messageExist.value = "";
      fileExist.value = "";
    } else if (fileExist) {
      fileExist.value = "";
    } else if (messageExist) {
      messageExist.value = "";
    }

    setMessages([...messages, message]);
  };

  const messagesBox = () => {
    return messages.length === 0 ? (
      <div className="center"></div>
    ) : (
      messages.map((m, i) => {
        const plaintext = decrypt(m.text);
        const isImage = plaintext.startsWith("data:image/png;base64,");
        return (
          <div
            className={"talk-container " + m.position}
            key={`talk-container-${i}`}
          >
            <div
              className={
                m.position === "right"
                  ? "talk-bubble tri-right btm-right"
                  : "talk-bubble tri-right btm-left"
              }
              key={`talk-position-${i}`}
            >
              <div
                className={isImage ? "" : "talktext"}
                key={`txt-or-img-${i}`}
              >
                {isImage ? (
                  <div key={`div-img-${i}`}>
                    <img
                      src={plaintext}
                      alt=""
                      key={`img-${i}`}
                      style={{
                        width: "calc(100% - 20px)",
                        margin: "10px",
                      }}
                    />
                  </div>
                ) : (
                  <p key={`text-${i}`}>{plaintext}</p>
                )}
              </div>
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div>
      <div ref={container} className="chat-container">
        {messagesBox()}
      </div>
      <div className="form">
        <form onSubmit={formOnSubmit} autoComplete="off">
          <div className="placeholder">
            <label>
              Hello <b>{username}</b>. Say something or send image:
            </label>
          </div>
          <div>
            <input
              id="input-text"
              ref={messageRef}
              onChange={textOnChange}
              className="input-message"
              type="text"
              placeholder="Enter message"
              autoCapitalize="off"
            />
            <input
              id="input-file"
              onChange={fileOnChange}
              className="input-message input-file"
              ref={fileRef}
              type="file"
              accept="image/png"
            />
          </div>
          <button className="submit" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
