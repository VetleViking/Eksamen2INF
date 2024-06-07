"use client";
import { decode_jwt, delete_user, get_users, make_admin, remove_admin } from "@/api/users";
import { get_loaned_items } from "@/api/items";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullListSearch from "@/components/FullListSearch";
import AddItem from "@/components/AddItem";
import ListItem from "@/components/ListItem";
import down_arrow from "../../images/down-arrow.svg";
import Image from "next/image";
import Button from "@/components/Button";

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
            <div>
                <div className="bg-quaternary p-4">
                    <div>
                        <p className="text-xl font-medium">Du er logget inn som: {username}</p>
                        <Button 
                            text="Logg ut"
                            onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                            }}/>
                    </div>
                    <div className=" flex justify-center my-8">
                        <p className="text-3xl font-semibold">Adminpanel</p>
                    </div>
                </div>
                <div className="lg:grid grid-cols-2">
                    <div className="my-4">
                        <div>
                            <p className="text-2xl font-semibold text-center my-4">Legg til utstyr</p>
                            <AddItem />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-center my-4">Utlånt utstyr</p>
                            {Object.keys(loanedItems).length ? (
                                <div className="mx-3">
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
                                <p className="text-center">Ingen utlånt utstyr</p>
                            )}
                        </div>
                        <div className="mx-4">
                            <p className="text-2xl font-semibold text-center my-4">Administrer brukere</p>
                            {users.map((user: any, index: number) => (
                                <div className="border border-black p-1 m-1" key={index}>
                                    <div className="p-1 border border-black mb-1 flex justify-between">
                                        <p>{user.username}</p>
                                        <p>{user.admin? "admin" : "ikke admin"}</p>
                                    </div>
                                    <div className="flex gap-4">
                                    <Button
                                        text="Slett bruker" 
                                        onClick={() => {
                                            delete_user(user.username).then(() => {
                                                fetchItems();
                                            });
                                        }}/>
                                    {user.admin ? 
                                        <Button
                                            text="Fjern admin" 
                                            onClick={() => {
                                                remove_admin(user.username).then(() => {
                                                    fetchItems();
                                                });
                                            }}/> : (
                                        <Button
                                            text="Gjør til admin" 
                                            onClick={() => {
                                                make_admin(user.username).then(() => {
                                                    fetchItems();
                                                });
                                            }}/>)}
                                    
                                    </div>
                                </div>)
                            )}
                        </div>
                    </div>
                    <div className="my-4">
                        <p className="text-2xl font-semibold text-center mb-4">Slett utstyr</p>
                        <FullListSearch 
                            type="admin"
                            username={username}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
