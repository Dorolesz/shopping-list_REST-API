import React, { useState } from 'react';
import './styles.css'; // Ha külön CSS fájlban szeretnéd a stílusokat kezelni

interface Termek {
  id: number;
  nev: string;
  mennyiseg: number;
  egyseg: string;
  megvasarolva: boolean;
}

const BevLista: React.FC = () => {
  const [termekek, setTermekek] = useState<Termek[]>([]);
  const [nev, setNev] = useState<string>('');
  const [mennyiseg, setMennyiseg] = useState<string>('');
  const [egyseg, setEgyseg] = useState<string>('');
  const [hiba, setHiba] = useState<string>('');

  const hozzaadTermek = () => {
    if (nev.trim() === '' || mennyiseg.trim() === '' || egyseg.trim() === '') {
      setHiba('Minden mező kitöltése kötelező!');
      return;
    }
    if (isNaN(Number(mennyiseg))) {
      setHiba('A mennyiség csak szám lehet!');
      return;
    }
    if (termekek.some(termek => termek.nev === nev)) {
      setHiba('Ez a termék már szerepel a listában!');
      return;
    }
    setTermekek([
      ...termekek,
      { id: Date.now(), nev, mennyiseg: Number(mennyiseg), egyseg, megvasarolva: false }
    ]);
    setNev('');
    setMennyiseg('');
    setEgyseg('');
    setHiba('');
  };

  const torolTermek = (id: number) => {
    setTermekek(termekek.filter(termek => termek.id !== id));
  };

  const valtMegvasarolva = (id: number) => {
    setTermekek(
      termekek.map(termek =>
        termek.id === id ? { ...termek, megvasarolva: !termek.megvasarolva } : termek
      )
    );
  };

  return (
    <div>
      <h1>Bevásárló Lista</h1>
      <div>
        <input
          type="text"
          placeholder="Termék neve"
          value={nev}
          onChange={(e) => setNev(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mennyiség"
          value={mennyiseg}
          onChange={(e) => setMennyiseg(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mennyiségi egység"
          value={egyseg}
          onChange={(e) => setEgyseg(e.target.value)}
        />
        <button onClick={hozzaadTermek}>Hozzáad</button>
        {hiba && <p style={{ color: 'red' }}>{hiba}</p>}
      </div>
      <ul>
        {termekek.map(termek => (
          <li key={termek.id} style={{ textDecoration: termek.megvasarolva ? 'line-through' : 'none' }}>
            {termek.nev} {termek.mennyiseg} {termek.egyseg}
            <button onClick={() => valtMegvasarolva(termek.id)}>
              {termek.megvasarolva ? 'Visszaállít' : 'Megvásárolva'}
            </button>
            <button onClick={() => torolTermek(termek.id)}>Törlés</button>
          </li>
        ))}
      </ul>
      {termekek.length > 0 && (
        <p>
          {termekek.filter(termek => !termek.megvasarolva).length === 0
            ? 'Minden termék meg van vásárolva!'
            : `Hátralévő termékek száma: ${termekek.filter(termek => !termek.megvasarolva).length}`}
        </p>
      )}
    </div>
  );
};

export default BevLista;