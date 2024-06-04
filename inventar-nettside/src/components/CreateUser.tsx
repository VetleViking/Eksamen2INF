"use client";
import { create_user, login } from "@/api/api";
import { useState } from "react";
import Button from "./Button";

const CreateUser = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const create_user_handler = async (username: string, password: string) => {
        const data = await create_user(username, password);
        
        if (data.message === "User created") {
            const loginData = await login(username, password);

            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
                window.location.href = '/';
            } else {
                setErrormessage(loginData.message);
            }
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
                text="Lag bruker" 
                onClick={() => {create_user_handler(username, password)}} />
            <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
        </div>
    );
};

export default CreateUser;