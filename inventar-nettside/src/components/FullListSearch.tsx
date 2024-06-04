"use client";
import { get_items, loan_items, decode_jwt, return_items, remove_items } from "@/api/api";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FullItemList from "@/components/FullItemList";
import Search from "@/components/Search";
import Footer from "@/components/Footer";

type FullListSearchProps = {
    type: string,
    username: string
};

const FullListSearch= ({type, username}: FullListSearchProps) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [groupBy, setGroupBy] = useState("Ingen");
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: any[] }>({});
  const [search, setSearch] = useState('');

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
    if (!items.length) {
      fetchItems();
    }
  }, [items]);

  function sortItems() {
    if (groupBy && filteredItems) {
      const norwegianToEnglish: { [key: string]: string } = {
        "Produsent": "manufacturer",
        "Beskrivelse": "description",
        "Innkjøpsdato": "purchaseDate",
        "Innkjøpspris": "purchasePrice",
        "Forventet levetid": "expectedLifetime",
        "Kategori": "category"
      };
  
      const englishGroupBy = norwegianToEnglish[groupBy];
  
      const convertDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split(".");
        return new Date(`${month}/${day}/${year}`).getTime();
      };

      // sorts items
      const newSortedItems = [...filteredItems].sort((a, b) => {
        if (englishGroupBy === 'purchasePrice') {
          return parseFloat(a[englishGroupBy]) - parseFloat(b[englishGroupBy]);
        } else if (englishGroupBy === 'purchaseDate') {
          return convertDate(a[englishGroupBy]) - convertDate(b[englishGroupBy]);
        } else {
          if (a[englishGroupBy] < b[englishGroupBy]) {
            return -1;
          }
          if (a[englishGroupBy] > b[englishGroupBy]) {
            return 1;
          }
          return 0;
        }
      });
  
      // groups items
      const groupedItems = newSortedItems.reduce((groups: { [key: string]: any[] }, item) => {
        const key = item[englishGroupBy];
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
  }

  useEffect(() => {
    sortItems();
  }, [groupBy, items, filteredItems]);

  useEffect(() => {
    const newFilteredItems = items.filter((item: any) => {
      const values = Object.values(item);
      return values.some(value => {
        const valueString = value !== null && value !== undefined ? value.toString() : '';
        return valueString.toLowerCase().includes(search.toLowerCase());
      });
    });

    if (type === 'loan') {
        setFilteredItems(newFilteredItems.filter((item: { loanedBy: any }) => !item.loanedBy));
    } else if (type === 'loans') {
        setFilteredItems(newFilteredItems.filter((item: { loanedBy: any }) => item.loanedBy === username));
    } else if (type === 'admin') {
        setFilteredItems(newFilteredItems);
    }
    sortItems();
  }, [search, items]);

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
            type === 'loan' ? (
            loan_items(selectedItems, username).then(() => {
              setSelectedItems([]);
              fetchItems();
            })) : type === 'loans' ? (
            return_items(selectedItems).then(() => {
                setSelectedItems([]);
                fetchItems()
            })) : type === 'admin' ? (
            remove_items(selectedItems).then(() => {
                setSelectedItems([]);
                fetchItems();
            })) : null;
          }}>{
           type === 'loan' ? "Lån ut" :  type === 'loans' ? "Lever inn" : type === 'admin' ? "Fjern" : ""
          }</button>
          <button onClick={() => {
            Object.values(groupedItems).forEach((group: any[]) => {
                group.forEach((item: any) => {
                    setSelectedItems(prevSelectedItems => {
                        if (!prevSelectedItems.includes(item.id)) {
                            return [...prevSelectedItems, item.id];
                        }
                        return prevSelectedItems;
                    });
                });
            });
          }}>Velg alt</button>
          <button onClick={() => {
            setSelectedItems([]);
          }}>Tøm valg</button>
        </div>
      </div>
      <Search 
        search={search}
        setSearch={setSearch}
      />
      <FullItemList
        groupByProps={{
          groupByOptions: ["Ingen", "Produsent", "Beskrivelse", "Innkjøpsdato", "Innkjøpspris", "Forventet levetid", "Kategori"],
          selectedGroupBy: groupBy,
          setSelectedGroupBy: setGroupBy
        }}
        items={groupedItems}
        sortBy={groupBy}
        onClicks={items.map((item: any) => () => handleItemClick(item.id))}
        selectedList={items.map((item: any) => selectedItems.includes(item.id))}
      />
    </div>
  );
}

export default FullListSearch;