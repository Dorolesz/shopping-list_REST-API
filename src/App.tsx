import React, { useEffect, useState } from 'react';
import './App.css';

interface ShoppingItem {
  id: string;
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
        const response = await fetch('https://retoolapi.dev/Wts2Ir/bevasarlolista');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const addItem = () => {
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

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      purchased: false,
    };

    setItems([...items, newItem]);
    setItemName('');
    setQuantity('');
    setUnit('');
    setError('');
  };

  const togglePurchased = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
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

function App() {
  return (
    <div className="App">
      <ShoppingListApp />
    </div>
  );
}

export default App;
