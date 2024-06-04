import { add_items } from "@/api/api";
import React, { useState } from "react";
import Button from "./Button";

const AddItem = () => {
    const [manufacturer, setManufacturer] = useState('');
    const [description, setDescription] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [expectedLifetime, setExpectedLifetime] = useState('');
    const [category, setCategory] = useState('');
    
    return (
        <div className="flex flex-col items-center mx-4">
            <div className="grid grid-cols-2 w-full gap-2">
                <input className="border border-black p-1" type="text" placeholder="Produsent" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}/>
                <input className="border border-black p-1" type="text" placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input className="border border-black p-1" type="text" placeholder="Spesifikasjoner" value={specifications} onChange={(e) => setSpecifications(e.target.value)}/>
                <div className="flex justify-between">
                    <input className="border border-black p-1" type="date" placeholder="Innkjøpsdato" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}/>
                    <button className="bg-main text-white px-2 rounded-md border-4 border-main hover:bg-white hover:text-main transition duration-300 ease-in-out min-w-max" onClick={() => {
                        const today = new Date();
                        const month = (today.getMonth() + 1).toString().padStart(2, '0');
                        const date = today.getDate().toString().padStart(2, '0');
                        setPurchaseDate(`${today.getFullYear()}-${month}-${date}`);
                    }}>I dag</button>
                </div>
                <input className="border border-black p-1" type="number" placeholder="Innkjøpspris" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)}/>
                <input className="border border-black p-1" type="number" placeholder="Forventet levetid" value={expectedLifetime} onChange={(e) => setExpectedLifetime(e.target.value)}/>
                <select className="border border-black p-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Kategori</option>
                    <option value="Bærbare Datamaskiner">Bærbare Datamaskiner</option>
                    <option value="Datamaskiner">Datamaskiner</option>
                    <option value="Mus og Tastatur">Mus og Tastatur</option>
                    <option value="Nettverksutstyr">Nettverksutstyr</option>
                    <option value="Projektorer">Projektorer</option>
                    <option value="Skjermer">Skjermer</option>
                    <option value="Skrivere">Skrivere</option>
                </select>
            </div>
            <Button
                text="Legg til"
                onClick={() => {
                    if (!manufacturer || !description || !specifications || !purchaseDate || !purchasePrice || !expectedLifetime || !category) {
                        return;
                    }
                    const dateSelected = new Date(purchaseDate);
                    const month = (dateSelected.getMonth() + 1).toString().padStart(2, '0');
                    const date = dateSelected.getDate().toString().padStart(2, '0');
                    const convertedDate = `${date}.${month}.${dateSelected.getFullYear()}`;
                    add_items([{ manufacturer, description, specifications, purchaseDate: convertedDate, purchasePrice: Number(purchasePrice), expectedLifetime: Number(expectedLifetime), category }]);
                }}
            />
        </div>
    );
};

export default AddItem;