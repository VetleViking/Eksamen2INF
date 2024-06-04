import { login } from "@/api/api";
import { useState } from "react";
import Button from "./Button";

const LoginComponent = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const login_handler = async (username: string, password: string) => {
        const data = await login(username, password);

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } else {
            setErrormessage(data.message);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <input 
                className="border border-black rounded-md p-1"
                type="text" 
                placeholder="brukernavn" 
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}/>

            <input 
                className="border border-black rounded-md p-1"
                type="password"
                placeholder="passord"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }} />

            <Button
                text="Logg inn" 
                onClick={() => {login_handler(username, password)}} />
            <p className="text-red-500 text-center">{errormessage}</p>
        </div>
    );
};

export default LoginComponent;