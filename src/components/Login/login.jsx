import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload"; // Make sure to provide the correct path to the upload function

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAvatar = (e) => {
        if (e.target.files[0]) { // Corrected typo in "files"
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Moved setloading(true) to here
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imgurl = avatar.file ? await upload(avatar.file) : "./avatar.png"; // Provide default avatar if no file is uploaded

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgurl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchat", res.user.uid), {
                chat: [],
            });

            toast.success("Account created! You can log in now.");
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                toast.error("The email address is already in use by another account.");
            } else {
                toast.error(err.message);
            } 
        } finally {
            setLoading(false); // Moved setloading(false) to here
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        const { email, password} = Object.fromEntries(formData);

        try{
            await signInWithEmailAndPassword(auth, email, password);

        }catch(err){
            console.log(err)
            toast.error(err.message)

        }
        finally{
            setLoading(false)
        }
        // Add login logic here
    };

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="MysteryEmail@example.com" name="email" />
                    <input type="password" placeholder="SecretPassword123" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className="separater"></div>
            <div className="item">
                <h2>Create an Account with Us!</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="Avatar" />
                        Upload an Image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="DigitalExplorer42" name="username" />
                    <input type="text" placeholder="MysteryEmail@example.com" name="email" />
                    <input type="password" placeholder="SecretPassword123" name="password" />
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
