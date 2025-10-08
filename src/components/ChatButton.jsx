import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react"; // Chat icon

const ChatButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const studentName = localStorage.getItem("studentName");

    if (!studentName) {
      // Redirect to login page
      navigate("/LogSign");
      return;
    }

    // Navigate to Chat page if logged in
    navigate("/Chat");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-14 right-3 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-50"
      title="Chat with us"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default ChatButton;
