"use client";
import { decode_jwt } from "@/api/api";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!username) {
      const token = localStorage.getItem('token');
      if (token) {
        decode_jwt(token).then(data => {
          setUsername(data);
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
      <div>
          <p>Logget inn som: {username}</p>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>Logg ut</button>
          <p>Lån utstyr</p>
        </div>
        <FullListSearch 
          type="loans"
          username={username}
        />
      <Footer />
    </div>
  );
}
