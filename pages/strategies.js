import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button, Col, Container,
} from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { getStrategies } from '../api/strategies';
import StrategyCard from '../components/StrategyCard';

export default function Strategies() {
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

  const getStrategyCards = () => {
    getStrategies(user.uid).then(setCards);
  };

  useEffect(() => {
    getStrategyCards();
  }, [cards, user]);

  return (
    <>
      <div className="strategyPg">
        <Container className="sContainer">
          <Col>
            <div className="allStrategies">
              <h1>All Strategies</h1>
            </div>
          </Col>
          <Col xs={4}>
            <Link href="/strategies/new" passHref>
              <Button className="stratBtn rounded-0" variant="dark">+ New Strategy</Button>
            </Link>
          </Col>
        </Container>
        <Container className="sCardContainer">
          <div className="stratCardList">
            {cards.map((strategy) => (
              <StrategyCard key={strategy.firebaseKey} strategyObj={strategy} />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
