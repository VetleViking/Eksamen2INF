import React, { useState } from "react";
import down_arrow from "../images/down-arrow.svg";
import Image from "next/image";

type ListProps = {
    item: {
        manufacturer: string;
        description: string;
        specifications: string;
        purchaseDate: string;
        purchasePrice: number;
        expectedLifetime: number;
        category: string;
    },
    onClick: () => void,
    selected: boolean,
    version: number
};

const ListItem= ({item, onClick, selected, version}: ListProps) => {
    const [dropdown, setDropdown] = useState(false);

    const handleImageClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDropdown(!dropdown);
    };

    return (
        <div className={`mx-1 border border-black cursor-pointer p-1 ${selected ? "bg-blue-200" : ""}`} onClick={onClick}>
            <div className="flex justify-between">
                <p>{item.description}</p>
                <Image src={down_arrow} alt="Down arrow" width={15} height={15} onClick={handleImageClick} className={dropdown ? "transform rotate-180" : ""}/>
            </div>
            {dropdown ? (
                <div className="border border-black p-1">
                    <p>Produsent: {item.manufacturer}</p>
                    <p>Beskrivelse: {item.description}</p>
                    <p>Spesifikasjoner: {item.specifications}</p>
                    <p>Innkjøpsdato: {item.purchaseDate}</p>
                    <p>Innkjøpspris: {item.purchasePrice}</p>
                    <p>Forventet levetid: {item.expectedLifetime}</p>
                    <p>Kategori: {item.category}</p>
                </div>
            ) : null}
        </div>
    );
};

export default ListItem;