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
  }, []);

  return (
    <div>
      <h1>All Strategies</h1>
      <Link href="/strategies/new" passHref>
        <Button variant="dark">+ New Strategy</Button>
      </Link>
      <div>
        {cards.map((strategy) => (
          <StrategyCard key={strategy.firebaseKey} strategyObj={strategy} />
        ))}
      </div>
    </div>
  );
}
