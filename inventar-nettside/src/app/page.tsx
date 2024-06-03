"use client";
import { upload_items, get_items, loan_items } from "@/api/api";
import GroupedListItem from "@/components/GroupedListItem";
import ListItem from "@/components/ListItem";
import SortBy from "@/components/GroupBy";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("Ingen");
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

  async function fetchItems() {
    const items = await get_items();
    setItems(items);
  }

  useEffect(() => {
    const handleLoad = () => fetchItems();
    window.addEventListener("load", handleLoad);
  });

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
  
      // groups items
      const groupedItems = newSortedItems.reduce((groups: { [key: string]: any[] }, item) => {
        const key = item[englishSortBy];
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {});
  

      // sorts items in groups by description
      Object.keys(groupedItems).forEach(group => {
        groupedItems[group].sort((a, b) => a.description.localeCompare(b.description));
      });
  
      setGroupedItems(groupedItems);
    }
  }, [sortBy, items]);

  return (
    <div>
      <div>
        <div>
          <p>valgt utstyr:</p> {(() => {
              const frequencyMap = selectedItems.reduce((acc, item) => {
                const description = (items[item] as { description: string }).description;
                acc[description] = (acc[description] || 0) + 1;
                return acc;
              }, {} as { [description: string]: number });
          
              return Object.keys(frequencyMap).map((description, index) => (
                <p key={index}>
                  {description}
                  {frequencyMap[description] > 1 ? ` x${frequencyMap[description]}` : ''}
                </p>
              ));
            })()}
        </div>
        <div>
          <button onClick={() => {
            loan_items(selectedItems, "test");
          }}>Lån ut</button>
          <button onClick={() => {
            setSelectedItems([]);
          }}>Tøm valg</button>
        </div>
      </div>
      <div>
        <SortBy
          groupByOptions={["Produsent", "Beskrivelse", "Innkjøpsdato", "Innkjøpspris", "Forventet levetid", "Kategori", "Ingen"]}
          selectedGroupBy={sortBy}
          setSelectedGroupBy={setSortBy}
        />
        <div>
        {Object.keys(groupedItems).map((key, index) => (
          sortBy === "Ingen" 
            ? groupedItems[key].map((item: any, index: number) => (
                <ListItem
                  key={index}
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                  selected={selectedItems.includes(item.id)}
                />
              ))
            : (
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
                  loanedBy: string 
                }]}
                onClicks={groupedItems[key].map((item: any, index: number) => () => handleItemClick(groupedItems[key][index].id))}
                selectedList={groupedItems[key].map((item: any, index: number) => selectedItems.includes(groupedItems[key][index].id))}
              />
            )
        ))}
        </div>
      </div>
    </div>
  );
}
