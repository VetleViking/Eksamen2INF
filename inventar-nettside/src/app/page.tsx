"use client";
import { upload_items, get_items } from "@/api/api";
import GroupedListItem from "@/components/GroupedListItem";
import ListItem from "@/components/ListItem";
import SortBy from "@/components/GroupBy";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [buttonClicked1, setButtonClicked1] = useState(false);
  const [buttonClicked2, setButtonClicked2] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("Produsent");
  const [sortedItems, setSortedItems] = useState(items);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: any[] }>({});

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
    if (sortBy && items) {
      const norwegianToEnglish: { [key: string]: string } = {
        "Produsent": "manufacturer",
        "Beskrivelse": "description",
        "Innkjøpsdato": "purchaseDate",
        "Innkjøpspris": "purchasePrice",
        "Forventet levetid": "expectedLifetime",
        "Kategori": "category"
      };

      const englishSortBy = norwegianToEnglish[sortBy];

      const convertDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split(".");
        return new Date(`${month}/${day}/${year}`).getTime();
      };

      const newSortedItems = [...items].sort((a, b) => {
        if (englishSortBy === 'purchasePrice') {
          return parseFloat(a[englishSortBy]) - parseFloat(b[englishSortBy]);
        } else if (englishSortBy === 'purchaseDate') {
          return convertDate(a[englishSortBy]) - convertDate(b[englishSortBy]);
        } else {
          if (a[englishSortBy] < b[englishSortBy]) {
            return -1;
          }
          if (a[englishSortBy] > b[englishSortBy]) {
            return 1;
          }
          return 0;
        }
      });

      const groupedItems = newSortedItems.reduce((groups: { [key: string]: any[] }, item) => {
        const key = item[englishSortBy];
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});

      setGroupedItems(groupedItems);
    }
  }, [sortBy, items]);

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
        <SortBy
          groupByOptions={["Produsent", "Beskrivelse", "Innkjøpsdato", "Innkjøpspris", "Forventet levetid", "Kategori"]}
          selectedGroupBy={sortBy}
          setSelectedGroupBy={setSortBy}
        />
        <div>
          {Object.keys(groupedItems).map((key, index) => (
            <GroupedListItem
              key={index}
              sortedBy={key}
              items={groupedItems[key] as [{ 
                manufacturer: string; 
                description: string; 
                specifications: string; 
                purchaseDate: string; 
                purchasePrice: number; 
                expectedLifetime: number; 
                category: string; 
                id: string;
                loanedBy: string }]}
              onClicks={groupedItems[key].map((item: any, index: number) => () => handleItemClick(groupedItems[key][index].id))}
              selectedList={groupedItems[key].map((item: any, index: number) => selectedItems.includes(groupedItems[key][index].id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
