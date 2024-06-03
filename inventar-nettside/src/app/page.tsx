"use client";
import { upload_items, get_items } from "@/api/api";
import ListItem from "@/components/ListItem";
import { useEffect, useState } from "react";

export default function Home() {
  const [buttonClicked1, setButtonClicked1] = useState(false);
  const [buttonClicked2, setButtonClicked2] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemClick = (index: number) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(index)) {
        return prevSelectedItems.filter(itemIndex => itemIndex !== index);
      } else {
        return [...prevSelectedItems, index];
      }
    });
  };

  useEffect(() => {
    if (buttonClicked1) {
      upload_items();
    }
  }, [buttonClicked1]);

  useEffect(() => {
    if (buttonClicked2) {
      get_items().then((data) => {
        setItems(data);
      });
    }
  }, [buttonClicked2]);

  return (
    <div>
      <p>Hello World!</p>
      <div className="flex gap-4 m-1">  
        <button className="border border-black rounded-md p-2" onClick={() => setButtonClicked1(true)}>Upload</button>
        <button className="border border-black rounded-md p-2" onClick={() => setButtonClicked2(true)}>Get</button>
      </div>
      <div>
        {items ? items.map((item: { manufacturer: string, description: string, specifications: string, purchaseDate: string, purchasePrice: number, expectedLifetime: number, category: string }, index: number) => (
          <ListItem
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
            selected={selectedItems.includes(index)}
            version={0}
          />
        )) : null}
      </div>
    </div>
  );
}
