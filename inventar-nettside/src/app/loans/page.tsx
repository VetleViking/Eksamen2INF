"use client";
import { decode_jwt } from "@/api/users";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";
import Button from "@/components/Button";

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!username) {
      const token = localStorage.getItem('token');
      if (token) {
        decode_jwt(token).then(data => {
          setUsername(data.username);
        }).catch(() => {
          localStorage.removeItem('token');
          window.location.href = '/login'
      });
      } else {
        window.location.href = '/login';
      }
    }
  }, [username]);

  return (
    <div>
      <Header />
      <div className="bg-quaternary p-4">
        <div>
          <p className="text-xl font-medium">Logget inn som: {username}</p>
          <Button
            text="Logg ut" 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}/>
        </div>
        <div className=" flex justify-center my-8">
          <p className="text-3xl font-semibold">Dine lånte utstyr</p>
        </div>
      </div>
      <FullListSearch 
        type="loans"
        username={username}
      />
      <Footer />
    </div>
  );
}
