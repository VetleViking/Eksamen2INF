"use client";
import React from 'react';

import CreateUser from "@/components/CreateUser";
import LoginComponent from "@/components/LoginComponent";

export default function Login() {
    return (
        <div className='flex justify-around flex-wrap mt-8'>
            <div>
                <LoginComponent />
            </div>
            <div>
                <CreateUser />
            </div>
        </div>
    );
}