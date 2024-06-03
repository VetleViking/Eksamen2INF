import React, { useState } from "react";
import down_arrow from "../images/down-arrow.svg";
import Image from "next/image";
import ListItem from "./ListItem";

type GroupedListProps = {
    sortedBy: string,
    items: [{
        manufacturer: string;
        description: string;
        specifications: string;
        purchaseDate: string;
        purchasePrice: number;
        expectedLifetime: number;
        category: string;
        id: string;
        loanedBy: string;
    }],
    onClicks: (() => void)[],
    selectedList: boolean[]
};

const GroupedListItem= ({items, onClicks, selectedList, sortedBy}: GroupedListProps) => {
    const [dropdown, setDropdown] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDropdown(!dropdown);
    };

    return (
        <div className={`mx-1 border border-black cursor-pointer p-1`} onClick={handleClick}>
            <div className="flex justify-between">
                <p>{sortedBy}</p>
                <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={dropdown ? "transform rotate-180" : ""}/>
            </div>
            <div>
                {dropdown ? items.map((item: {
                    manufacturer: string,
                    description: string,
                    specifications: string,
                    purchaseDate: string,
                    purchasePrice: number,
                    expectedLifetime: number,
                    category: string,
                    id: string,
                    loanedBy: string
                }, index) => (
                    <ListItem
                        key={index}
                        item={item}
                        onClick={onClicks[index]}
                        selected={selectedList[index]}
                    />)) : null}
            </div>
        </div>
    );
};

export default GroupedListItem;