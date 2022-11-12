import { useLocation } from "react-router-dom";

function Chat() {
  const { state } = useLocation();
  const { id } = state;

  return (
    <div className="App select-none">
      <header className="App-header">
        <h1>{id}</h1>
      </header>
    </div>
  );
}

export default Chat;
