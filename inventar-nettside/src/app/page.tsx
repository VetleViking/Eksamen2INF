"use client";
import { decode_jwt } from "@/api/users";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";
import Button from "@/components/Button";
import { add_items } from "@/api/items";

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
          <p className="text-xl font-medium">Du er logget inn som: {username}</p>
          <Button 
            text="Logg ut"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}/>
          <Button
            text="test"
            onClick={() => {
              add_items();
            }}/>
        </div>
        <div className=" flex justify-center my-8">
          <p className="text-3xl font-semibold">Lån utstyr</p>
        </div>
      </div>
      <FullListSearch 
        type="loan"
        username={username}
      />
      <Footer />
    </div>
  );
}
