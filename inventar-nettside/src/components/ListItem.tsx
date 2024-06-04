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

const ListItem = ({ item, onClick, selected }: ListProps) => {
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
        <div className={`border border-black cursor-pointer p-1 mx-1 ${selected ? "bg-blue-200" : ""}`} onClick={handleClick}>
            <div className="flex justify-between">
                <p className="font-medium">{item.description}</p>
                <Image src={down_arrow} alt="Down arrow" width={15} height={15} onClick={handleImageClick} className={dropdown ? "transform rotate-180" : ""}/>
            </div>
            {dropdown ? (
                <div className="border border-black p-1 mt-1">
                    <p><span className="font-medium">Produsent:</span> {item.manufacturer}</p>
                    <p><span className="font-medium">Beskrivelse:</span> {item.description}</p>
                    <p><span className="font-medium">Spesifikasjoner:</span> {item.specifications}</p>
                    <p><span className="font-medium">Innkjøpsdato:</span> {item.purchaseDate}</p>
                    <p><span className="font-medium">Innkjøpspris:</span> {item.purchasePrice}</p>
                    <p><span className="font-medium">Forventet levetid:</span> {item.expectedLifetime} år</p>
                    <p><span className="font-medium">Kategori:</span> {item.category}</p>
                    {item.loanedBy ? <p><span className="font-medium">Lånt av:</span> {item.loanedBy}</p> : null}
                </div>
            ) : null}
        </div>
    );
};

export default ListItem;