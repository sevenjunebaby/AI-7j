import React, { useState } from "react";
import axios from "axios";
import "./ChatApp.css";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to the chat
    const userMessage = { text: userInput, sender: "user" };
    setMessages([...messages, userMessage]);

    setIsTyping(true); // Show typing indicator

    try {
      // Send request to Flask API
      const response = await axios.post("http://localhost:5000/chat", {
        question: userInput,
      });

      // Simulate typing effect for bot's reply
      const botReply = response.data.reply;
      typeBotMessage(botReply);
    } catch (error) {
      console.error("Error connecting to the Flask backend:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error communicating with the server.", sender: "bot" },
      ]);
      setIsTyping(false);
    }

    setUserInput(""); // Clear input field after message is sent
  };

  const typeBotMessage = (message) => {
    let currentText = "";
    const interval = 15; // Typing speed in milliseconds

    message.split("").forEach((char, index) => {
      setTimeout(() => {
        currentText += char;
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove the incomplete message
          { text: currentText, sender: "bot" },
        ]);

        if (index === message.length - 1) setIsTyping(false); // Typing finished
      }, index * interval);
    });
  };

  return (
    <div className="chat-container">
      <div id="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "bot-message"}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Typing...</div>}
      </div>
      <input
        type="text"
        id="user-input"
        placeholder="Ask something..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
