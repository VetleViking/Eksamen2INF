"use client";
import { decode_jwt, get_loaned_items } from "@/api/api";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";
import AddItem from "@/components/AddItem";

export default function Home() {
    const [username, setUsername] = useState('');
    const [loanedItems, setLoanedItems] = useState([]);

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

    async function fetchItems() {
        const items = await get_loaned_items();
        setLoanedItems(items);
    }

    useEffect(() => {
        if (!loanedItems.length) {
            fetchItems();
        }
    }, [loanedItems]);
    

    return (
        <div>
        <Header />
        <div className="grid grid-cols-2">
            <p>Logget inn som: {username}</p>
            <button onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}>Logg ut</button>
            
                <div>
                    <div>
                        <p>Legg til utstyr</p>
                        <AddItem />
                    </div>
                    <div>
                        <p>Utlånt utstyr</p>
                    </div>
                </div>
                <div>
                    <p>Slett utstyr</p>
                    <FullListSearch 
                        type="admin"
                        username={username}
                    />
                </div>
            </div>
        <Footer />
        </div>
    );
}
