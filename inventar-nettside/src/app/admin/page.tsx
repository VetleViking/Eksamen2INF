"use client";
import { decode_jwt, get_loaned_items, get_users, make_admin } from "@/api/api";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";
import AddItem from "@/components/AddItem";
import ListItem from "@/components/ListItem";
import down_arrow from "../../images/down-arrow.svg";
import Image from "next/image";

export default function Home() {
    const [username, setUsername] = useState('');
    const [loanedItems, setLoanedItems] = useState([]);
    const [haveFetchedItems, setHaveFetchedItems] = useState(false);
    const [dropdowns, setDropdowns] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!username) {
        const token = localStorage.getItem('token');
        if (token) {
            decode_jwt(token).then(data => {
                if (!data.admin) {
                    window.location.href = '/';
                }
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

    const handleItemClick = (user: string) => {
        setDropdowns(prevSelectedDropdowns => {
          if (prevSelectedDropdowns.includes(user)) {
            return prevSelectedDropdowns.filter(itemIndex => itemIndex !== user);
          } else {
            return [...prevSelectedDropdowns, user];
          }
        });
      };

    useEffect(() => {
        
    }, [dropdowns]);

    async function fetchItems() {
        const items = await get_loaned_items();
        const users = await get_users();
        setLoanedItems(items);
        setUsers(users);
        setHaveFetchedItems(true);
    }

    useEffect(() => {
        if (!haveFetchedItems) {
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
                    {Object.keys(loanedItems).length ? (
                        <div>
                            {Object.keys(loanedItems).map((loanedBy: any) => (
                                <div className="border border-black py-1 m-1" key={loanedBy} onClick={() => handleItemClick(loanedBy)}>
                                    <div className="flex justify-between px-1">
                                        <p>{loanedBy}</p>
                                        <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={`transform ${dropdowns.includes(loanedBy) ? 'rotate-180' : ''}`}/>
                                    </div>
                                    {!dropdowns.includes(loanedBy) ? null : (
                                        <div>
                                            {(loanedItems[loanedBy] as string[]).map((item: string) => {
                                                const parsedItem = JSON.parse(item);
                                                return (
                                                    <div key={parsedItem.id}>
                                                        <ListItem 
                                                            item={parsedItem}
                                                            onClick={() => {}}
                                                            selected={false}    
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Ingen utlånt utstyr</p>
                    )}
                    </div>
                    <div>
                        <p>Gjør brukere til admin-bruker</p>
                        {users.map((user: any, index: number) => (
                            user.admin ? null : (
                                <div className="border border-black p-1 m-1" key={index}>
                                    <p className="p-1 border border-black mb-1">{user.username}</p>
                                    <button className="border border-black p-1" onClick={() => {
                                        make_admin(user.username).then(() => {
                                            fetchItems();
                                        });
                                    }}>Gjør til admin</button>
                                </div>)
                        ))}
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
