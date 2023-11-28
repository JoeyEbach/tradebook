import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
import { getTrades } from '../api/trades';
import TradeCard from '../components/TradeCard';

export default function Trades() {
  const [cards, setCards] = useState([]);
  const { user } = useAuth();

  const getTradeCards = () => {
    getTrades(user.uid)?.then(setCards);
  };

  useEffect(() => {
    getTradeCards();
  }, [user, cards]);

  return (
    <div className="tradesPg">
      <h1>All Trades</h1>
      <div>
        {cards?.map((trade) => (
          <TradeCard key={trade.firebaseKey} tradeObj={trade} />
        ))}
      </div>
    </div>
  );
}
