import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getStrategies } from '../api/strategies';
import StrategyCard from '../components/StrategyCard';

export default function Strategies() {
  const [cards, setCards] = useState([]);
  const { user } = useAuth();

  const getStrategyCards = () => {
    getStrategies(user.uid).then(setCards);
  };

  useEffect(() => {
    getStrategyCards();
  }, [user, cards]);

  return (
    <div className="strategyPg">
      <div className="allStrategies">
        <h1>All Strategies</h1>
      </div>
      <Link href="/strategies/new" passHref>
        <Button className="stratBtn rounded-0" variant="dark">+ New Strategy</Button>
      </Link>
      <div className="stratCardList">
        {cards.map((strategy) => (
          <StrategyCard key={strategy.firebaseKey} strategyObj={strategy} />
        ))}
      </div>
    </div>
  );
}
