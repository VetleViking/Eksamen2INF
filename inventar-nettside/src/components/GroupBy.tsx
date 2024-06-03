import React, { useState } from "react";
import down_arrow from "../images/down-arrow.svg";
import Image from "next/image";

type GroupProps = {
    groupByOptions: string[];
    selectedGroupBy: string;
    setSelectedGroupBy: (GroupOption: string) => void;
};

const GroupBy= ({groupByOptions, selectedGroupBy, setSelectedGroupBy}: GroupProps) => {
    const [dropdown, setDropdown] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        setDropdown(!dropdown);
    };
    
    if (dropdown) {
        return (
            <div className="border border-black p-1 cursor-pointer m-1" onClick={handleClick}>
                <div className="flex justify-between">
                    <p>Grupper etter: {selectedGroupBy}</p>
                    <Image src={down_arrow} alt="Down arrow" width={15} height={15} className="transform rotate-180"/>
                </div>
                <div className="border border-black p-1">
                    {groupByOptions.map((option, index) => (
                        <p key={index} onClick={() => setSelectedGroupBy(option)}>{option}</p>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-black p-1 cursor-pointer m-1" onClick={handleClick}>
            <div className="flex justify-between">
                <p>Grupper etter: {selectedGroupBy}</p>
                <Image src={down_arrow} alt="Down arrow" width={15} height={15}/>
            </div>
        </div>
    );
};

export default GroupBy;