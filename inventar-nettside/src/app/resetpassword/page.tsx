"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { reset_password } from '@/api/users';

export default function Login() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');


    if (!token || !email) {
        window.location.href = '/login';
    }

    const reset_password_handler = async () => {
        if (newPassword !== confirmNewPassword) {
            setErrormessage('Passwords do not match');
            return;
        }

        const data = await reset_password(token as string, newPassword);

        if (data.message === 'Password reset') {
            window.location.href = '/login';
        } else {
            setErrormessage(data.message);
        }
    }

    return (
        <div>
            <Header />
            <div className='flex justify-around flex-col items-center flex-wrap my-16 gap-8 mx-4'>
                <p className='text-xl font-semibold'>Tilbakestill passord for {email}</p>
                <div className='flex flex-col gap-4'>
                    <input 
                        className='border border-black rounded-md p-1 w-48'
                        type="password" 
                        placeholder="Nytt passord"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}/>
                    <input 
                        className='border border-black rounded-md p-1 w-48'
                        type="password" 
                        placeholder="Bekreft nytt passord"
                        value={confirmNewPassword}
                        onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                        }}/>
                </div>
                <Button 
                    text="Tilbakestill passord" 
                    onClick={() => reset_password_handler()}/>
                <p className="text-red-500 text-center">{errormessage}</p>
            </div>
            <Footer />
        </div>
    );
}