"use client";
import React from 'react';

import CreateUser from "@/components/CreateUser";
import LoginComponent from "@/components/LoginComponent";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Login() {
    return (
        <div>
            <Header />
            <div className='flex justify-around flex-wrap my-16 gap-12 mx-4'>
                <div>
                    <LoginComponent />
                </div>
                <div>
                    <CreateUser />
                </div>
            </div>
            <Footer />
        </div>
    );
}