import "./adduser.css";
import { db } from "../../../../lib/firebase";
import {
    serverTimestamp,
    collection,
    getDocs,
    query,
    setDoc,
    doc,
    where,
    arrayUnion,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userstore";

const Adduser = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
                setError(null);
            } else {
                setUser(null);
                setError("User not found");
            }
        } catch (err) {
            console.log(err);
            setError("Error searching for user");
        }
    };

    const handleAdd = async () => {
        if (!user) {
            setError("No user to add");
            return;
        }

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            const chatData = {
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: user.id,
                updatedAt: Date.now(),
            };

            const currentUserChatData = {
                ...chatData,
                receiverId: user.id,
            };

            const otherUserChatData = {
                ...chatData,
                receiverId: currentUser.id,
            };

            const userChatDocRef = doc(userChatsRef, user.id);
            const userChatDocSnap = await getDoc(userChatDocRef);
            if (!userChatDocSnap.exists()) {
                await setDoc(userChatDocRef, { chats: [] });
            }
            await updateDoc(userChatDocRef, {
                chats: arrayUnion(otherUserChatData),
            });

            const currentUserChatDocRef = doc(userChatsRef, currentUser.id);
            const currentUserChatDocSnap = await getDoc(currentUserChatDocRef);
            if (!currentUserChatDocSnap.exists()) {
                await setDoc(currentUserChatDocRef, { chats: [] });
            }
            await updateDoc(currentUserChatDocRef, {
                chats: arrayUnion(currentUserChatData),
            });

            setError(null);
        } catch (err) {
            console.log(err);
            setError("Error adding user to chat");
        }
    };

    return (
        <div className="adduser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button type="submit">Search</button>
            </form>
            {error && <div className="error">{error}</div>}
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default Adduser;
