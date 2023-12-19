import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getTrades } from '../api/trades';
import TradeCard from '../components/TradeCard';

export default function Trades() {
  const [cards, setCards] = useState([]);
  const { user } = useAuth();

  const selectedTheme = localStorage.getItem('selectedTheme');

  if (selectedTheme === 'light') {
    document.querySelector('body').setAttribute('data-theme', 'light');
    localStorage.setItem('selectedTheme', 'light');
  } else {
    document.querySelector('body').setAttribute('data-theme', 'dark');
    localStorage.setItem('selectedTheme', 'dark');
  }

  const getTradeCards = () => {
    getTrades(user.uid)?.then(setCards);
  };

  useEffect(() => {
    getTradeCards();
  }, [user.uid, cards]);

  return (
    <div className="tradesPage">
      <Container className="tcHeader">
        <div>
          <h1>All Trades</h1>
        </div>
      </Container>
      <Container className="tcList">
        <div>
          {cards?.map((trade) => (
            <TradeCard key={trade.firebaseKey} tradeObj={trade} />
          ))}
        </div>
      </Container>
    </div>
  );
}
