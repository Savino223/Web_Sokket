import { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.88.63:3000");
    setSocket(ws);

    ws.onopen = () => console.log("Connected to WebSocket");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "history") {
        setMessages(message.data);
      } else if (message.type === "message") {
        setMessages((prev) => [...prev, { data: message.data }]);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", data: input }));
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md shadow-md rounded-lg overflow-hidden p-6">
        <div className="pb-4 bg-white">
          <h1 className="text-2xl font-bold text-left">WebSocket Chat</h1>
        </div>
        
        <div className="h-[500px] overflow-y-auto rounded-lg p-4 bg-gray-100 border border-black">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className="mb-3 max-w-fit max-w-[80%] break-words text-left rounded-lg py-2 px-4 bg-blue-500 text-white self-start"
            >
              {msg.data}
            </div>
          ))}
        </div>
        
        <form onSubmit={sendMessage} className="flex pt-4 border-t border-gray-200 bg-white">
          <input
            className="flex-1 p-2 border rounded-lg"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение"
          />
          <button
            type="submit"
            className="ml-2 px-8 py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;