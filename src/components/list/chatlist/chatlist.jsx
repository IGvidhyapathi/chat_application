import React, { useState, useEffect } from "react";
import Adduser from "./adduser/adduser";
import "./chatlist.css"; // Ensure the correct path to your CSS file
import { useUserStore } from "../../../lib/userstore";
import { db } from "../../../lib/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../../lib/chatStore";

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useUserStore((state) => state.currentUser);
  const { chatId, changeChat } = useChatStore((state) => ({
    chatId: state.chatId,
    changeChat: state.changeChat,
  }));

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      try {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      } catch (error) {
        console.error("Error fetching chat data: ", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsub();
    };
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const updatedChats = chats.map((item) =>
      item.chatId === chat.chatId ? { ...item, isSeen: true } : item
    );

    try {
      await updateDoc(doc(db, "userchats", currentUser.id), {
        chats: updatedChats.map(({ user, ...rest }) => rest),
      });
      setChats(updatedChats);
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error("Error updating chat data: ", err);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchbar">
          <img src="/search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="add"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img src={chat.user?.avatar || "./avatar.png"} alt="avatar" />
            <div className="texts">
              <span>{chat.user?.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <h2 className="nochats">No Chats Available🥺</h2>
      )}
      {addMode && <Adduser />}
    </div>
  );
};

export default Chatlist;
