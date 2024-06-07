"use client";
import React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ForgotPasswordEmail from '@/components/ForgotPasswordEmail';

export default function Login() {
    return (
        <div>
            <Header />
            <div className='flex justify-around flex-wrap my-16 gap-12 mx-4'>
                <ForgotPasswordEmail />
            </div>
            <Footer />
        </div>
    );
}