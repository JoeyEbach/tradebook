import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { getStrategyDetails } from '../../api/mergedData';
import TradeCard from '../../components/TradeCard';
import { getRulesByStratId } from '../../api/rules';

export default function ViewStrategy() {
  const [strategyDetails, setStrategyDetails] = useState({});
  const [rules, setRules] = useState([]);
  const [wins, setWins] = useState([]);
  const [losses, setLosses] = useState([]);
  const router = useRouter();
  const { firebaseKey } = router.query;

  const getStrategy = () => {
    getStrategyDetails(firebaseKey)?.then((stratObj) => {
      setStrategyDetails(stratObj);
      getRulesByStratId(firebaseKey)?.then(setRules);
    });
    setWins(strategyDetails.trades?.filter((item) => item.status === 'Win'));
    setLosses(strategyDetails.trades?.filter((strat) => strat.status === 'Loss'));
  };

  useEffect(() => {
    getStrategy();
  }, [strategyDetails.trades]);

  return (
    <div className="viewStratPg">
      <Container className="singleStratInfo">
        <Row>
          <Col className="ssInfo">
            <h1>{strategyDetails.name} {strategyDetails.favorite ? '♥' : ''}</h1>
            <p>Start Date: {strategyDetails.date}</p>
            <h3>Goal Type: {strategyDetails.goalType}</h3>
            <h6>Goal: {strategyDetails.goal}</h6>
          </Col>
          <Col className="ssRules">
            {rules && <h5>Strategy Rules:</h5>}
            {rules && rules?.map((item) => <p key={rules.firebaseKey}>&#8226; {item.rule}</p>)}
          </Col>
        </Row>
      </Container>
      <Container className="viewStratBtn">
        <Link href={`/trades/new/${strategyDetails.firebaseKey}`} passHref>
          <Button className="newTradeBtn rounded-0" variant="dark">+ New Trade</Button>
        </Link>
      </Container>
      <Container className="winLoss">
        <Row>
          <Col>
            <p>Wins: {wins?.length ? `${wins.length}` : '0'} | Losses: {losses?.length ? `${losses.length}` : '0'}</p>
            <p>Trades Logged: {strategyDetails.trades?.length}</p>
          </Col>
        </Row>
      </Container>
      <Container className="line">
        <hr style={{
          height: '2px',
          backgroundColor: '#0097b2',
          color: '#0097b2',
          border: '#0097b2',
          width: '776px',
        }}
        />
      </Container>
      <Container className="dLoadBtn">
        <Link href={`/strategies/table/${strategyDetails.firebaseKey}`} passHref>
          <Button className="downloadBtn rounded-0" variant="dark">Download Trades</Button>
        </Link>
      </Container>
      <Container className="tcList">
        <div className="singleStratTrades">
          {strategyDetails.trades?.map((trade) => (
            <TradeCard key={trade.firebaseKey} tradeObj={trade} />
          ))}
        </div>
      </Container>
    </div>
  );
}
