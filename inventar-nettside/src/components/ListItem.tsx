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
        id: string;
        loanedBy: string;
    },
    onClick: () => void,
    selected: boolean,
};

const ListItem= ({ item, onClick, selected }: ListProps) => {
    const [dropdown, setDropdown] = useState(false);

    const handleImageClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDropdown(!dropdown);
    };

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onClick();
    };


    return (
        <div className={`mx-1 border border-black cursor-pointer p-1 ${selected ? "bg-blue-200" : ""}`} onClick={handleClick}>
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
                    <p>Forventet levetid: {item.expectedLifetime} år</p>
                    <p>Kategori: {item.category}</p>
                    {item.loanedBy ? <p>Lånt av: {item.loanedBy}</p> : null}
                </div>
            ) : null}
        </div>
    );
};

export default ListItem;