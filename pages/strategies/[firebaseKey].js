import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getStrategyDetails } from '../../api/mergedData';
import TradeCard from '../../components/TradeCard';

export default function ViewStrategy() {
  const [strategyDetails, setStrategyDetails] = useState({});
  const [wins, setWins] = useState([]);
  const [losses, setLosses] = useState([]);
  const router = useRouter();
  const { firebaseKey } = router.query;

  const getStrategy = () => {
    getStrategyDetails(firebaseKey)?.then(setStrategyDetails);
    setWins(strategyDetails.trades?.filter((item) => item.status === 'Win'));
    setLosses(strategyDetails.trades?.filter((strat) => strat.status === 'Loss'));
  };

  useEffect(() => {
    getStrategy();
  }, [firebaseKey, strategyDetails]);

  return (
    <div className="viewStratPg">
      <h1>{strategyDetails.name} {strategyDetails.favorite ? '♥' : ''}</h1>
      <p>Start Date: {strategyDetails.date}</p>
      <h3>Goal Type: {strategyDetails.goalType}</h3>
      <h6>Goal: {strategyDetails.goal}</h6>
      <Link href={`/trades/new/${strategyDetails.firebaseKey}`} passHref>
        <Button className="newTradeBtn" variant="dark">+ New Trade</Button>
      </Link>
      <p>Wins: {wins?.length ? `${wins.length}` : '0'} | Losses: {losses?.length ? `${losses.length}` : '0'}</p>
      <p>Trades Logged: {strategyDetails.trades?.length}</p>

      {strategyDetails.trades?.map((trade) => (
        <TradeCard key={trade.firebaseKey} tradeObj={trade} />
      ))}
    </div>
  );
}
