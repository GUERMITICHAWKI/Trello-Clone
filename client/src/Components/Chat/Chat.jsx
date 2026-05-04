import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../../Utils/socket";
import styled from "styled-components";

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;
`;

const Header = styled.div`
  background: #0079bf;
  color: #fff;
  padding: 12px 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const MessagesContainer = styled.div`
  flex: 1;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwn }) => (isOwn ? "flex-end" : "flex-start")};
`;

const SenderName = styled.span`
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
`;

const Bubble = styled.div`
  background: ${({ isOwn }) => (isOwn ? "#0079bf" : "#f0f0f0")};
  color: ${({ isOwn }) => (isOwn ? "#fff" : "#333")};
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 220px;
  font-size: 13px;
  word-break: break-word;
`;

const InputRow = styled.div`
  display: flex;
  border-top: 1px solid #eee;
  padding: 8px;
  gap: 6px;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  &:focus { border-color: #0079bf; }
`;

const SendBtn = styled.button`
  background: #0079bf;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  &:hover { background: #005f99; }
`;

const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ color }) => color || "#aaa"};
  color: white;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 2px;
`;

const Chat = ({ boardId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
const user = useSelector((state) => state.user.userInfo);

  // Load history and join room
  useEffect(() => {
    if (!boardId) return;

    axios.get(`http://localhost:3001/message/${boardId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => setMessages(res.data));

    socket.emit("join_board", boardId);

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (!open) setUnread((u) => u + 1);
    });

    return () => socket.off("receive_message");
  }, [boardId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) setUnread(0);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send_message", {
      boardId,
      sender: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        color: user.color,
      },
      text: text.trim(),
    });
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <ChatWrapper>
      <Header onClick={handleOpen}>
        <span>💬 Board Chat</span>
        <span>
          {unread > 0 && (
            <span style={{
              background: "#eb5a46", borderRadius: "50%",
              padding: "2px 7px", fontSize: 11, marginRight: 8
            }}>
              {unread}
            </span>
          )}
          {open ? "▼" : "▲"}
        </span>
      </Header>

      {open && (
        <>
          <MessagesContainer>
            {messages.map((msg) => {
              const isOwn = msg.sender._id === user._id;
              return (
                <MessageBubble key={msg._id} isOwn={isOwn}>
                  <Avatar color={msg.sender.color}>
                    {msg.sender.name?.[0]}{msg.sender.surname?.[0]}
                  </Avatar>
                  {!isOwn && (
                    <SenderName>{msg.sender.name} {msg.sender.surname}</SenderName>
                  )}
                  <Bubble isOwn={isOwn}>{msg.text}</Bubble>
                </MessageBubble>
              );
            })}
            <div ref={bottomRef} />
          </MessagesContainer>

          <InputRow>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Write a message..."
            />
            <SendBtn onClick={sendMessage}>Send</SendBtn>
          </InputRow>
        </>
      )}
    </ChatWrapper>
  );
};

export default Chat;