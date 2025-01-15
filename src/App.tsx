import React, { useEffect, useState } from 'react';
import './App.css';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

const ShoppingListApp: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://retoolapi.dev/1AFf5s/data');
        const data = await response.json();
        
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.Termék,
          quantity: item.Mennyiség,
          unit: item['Mennyiségi egység'],
          purchased: false,
        }));

        setItems(mappedData);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (!itemName.trim() || !quantity || !unit) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('A mennyiségnek számnak kell lennie és nagyobbnak kell lennie 0-nál!');
      return;
    }

    if (items.some((item) => item.name === itemName)) {
      setError('Ez a termék már szerepel a listán!');
      return;
    }

    const maxId = Math.max(...items.map((item) => item.id));
    const newItemId = maxId + 1;

    const newItem: ShoppingItem = {
      id: newItemId,
      name: itemName.trim(),
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      purchased: false,
    };

    try {
      await fetch('https://retoolapi.dev/1AFf5s/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newItem.id,
          Termék: newItem.name,
          Mennyiség: newItem.quantity,
          'Mennyiségi egység': newItem.unit,
        }),
      });
      setItems([...items, newItem]);
      setItemName('');
      setQuantity('');
      setUnit('');
      setError('');
    } catch (error) {
      setError('Hiba történt az új tétel hozzáadása közben!');
      console.error('Error adding item:', error);
    }
  };

  const togglePurchased = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteItem = async (id: number) => {
    try {
      await fetch(`https://retoolapi.dev/1AFf5s/data/${id}`, {
        method: 'DELETE',
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      setError('Hiba történt a tétel törlése közben!');
      console.error('Error deleting item:', error);
    }
  };

  const allItemsPurchased = items.length > 0 && items.every((item) => item.purchased);
  const remainingItemsCount = items.filter((item) => !item.purchased).length;

  return (
    <div className="app">
      <h1>Bevásárló lista</h1>
      {error && <p className="error">{error}</p>}

      <div className="input-container">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Termék neve"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Mennyiség"
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Mennyiségi egység"
        />
        <button onClick={addItem}>Hozzáadás</button>
      </div>

      {allItemsPurchased ? (
        <p className="success">Minden terméket megvásároltál!</p>
      ) : items.length > 0 ? (
        <p className="remaining-items">Hátralévő tételek: {remainingItemsCount}</p>
      ) : null}

      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.purchased ? 'purchased' : ''}>
            <span>{item.name} ({item.quantity} {item.unit})</span>
            <div>
              <button onClick={() => togglePurchased(item.id)}>
                {item.purchased ? 'Nem vásárolt' : 'Megvásárolva'}
              </button>
              <button onClick={() => deleteItem(item.id)}>Törlés</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <div className="App">
      <ShoppingListApp />
    </div>
  );
}

export default App;
