import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userstore";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "./detail.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();
  const [db, setDb] = useState(null); // State to hold the Firestore instance

  useEffect(() => {
    const initializeFirestore = async () => {
      const firestore = getFirestore();
      setDb(firestore); // Set the Firestore instance to state
    };

    initializeFirestore();
  }, []);

  const handleBlock = async () => {
    if (!user || !db) return; // Ensure user and db are available

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{user?.username}</h2>
        <p>Hey I'm using VpChatApp</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="Toggle Arrow" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="Toggle Arrow" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="Toggle Arrow" />
          </div>
          <div className="photos">
            <div className="photoitem">
              <div className="photodetail">
                <img
                  src="https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Photo 1"
                />
                <span>Photo_2024</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img
                  src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Photo 2"
                />
                <span>Photo_2024</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img
                  src="https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Photo 3"
                />
                <span>Photo_2024</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
            <div className="photoitem">
              <div className="photodetail">
                <img
                  src="https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Photo 4"
                />
                <span>Photo_2024</span>
              </div>
              <img src="./download.png" alt="Download Icon" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="Toggle Arrow" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked ? "you are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
