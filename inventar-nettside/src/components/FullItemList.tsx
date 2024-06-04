import React from "react";
import GroupedListItem from "./GroupedListItem";
import ListItem from "./ListItem";

type FullItemListProps = {
    items: { [key: string]: any[] },
    sortBy: string,
    onClicks: (() => void)[],
    selectedList: boolean[]
};

const FullItemList = ({ items, sortBy, onClicks, selectedList }: FullItemListProps) => {
    return (
        <div>
            
            <div>
            {Object.keys(items).map((key: string, index: number) => (
            sortBy === "Ingen" 
                ? items[key].map((item: any, index: number) => (
                    <ListItem
                    key={index}
                    item={item}
                    onClick={() => onClicks[item.id]()}
                    selected={selectedList[item.id]}
                    />
                ))
                : (
                <GroupedListItem
                    key={index}
                    groupedBy={key}
                    items={items[key] as [{ 
                        manufacturer: string; 
                        description: string; 
                        specifications: string; 
                        purchaseDate: string; 
                        purchasePrice: number; 
                        expectedLifetime: number; 
                        category: string; 
                        id: string;
                        loanedBy: string 
                    }]}
                    onClicks={items[key].map((item: any, index: number) => () => onClicks[items[key][index].id]())}
                    selectedList={items[key].map((item: any, index: number) => selectedList[item.id])}
                />
                )
            ))}
            </div>
      </div>
    );
};

export default FullItemList;