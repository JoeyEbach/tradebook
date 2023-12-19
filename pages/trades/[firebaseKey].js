/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { deleteTradeImagesRelationship, getTradeDetails } from '../../api/mergedData';
import { viewStrategy } from '../../api/strategies';

export default function ViewTrade() {
  const [tradeDetails, setTradeDetails] = useState({});
  const [strategy, setStrategy] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  const getTrade = () => {
    getTradeDetails(firebaseKey)?.then((obj) => {
      setTradeDetails(obj);
      viewStrategy(obj.strategyId)?.then(setStrategy);
    });
  };

  const deleteATrade = () => {
    if (window.confirm(`Are you sure you want to delete this ${tradeDetails.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeDetails.firebaseKey).then(() => router.push('/trades'));
    }
  };

  useEffect(() => {
    getTrade();
  }, [tradeDetails, firebaseKey]);

  return (
    <div className="viewTradePg">
      <Container className="singleTradeHead">
        <Row>
          <Col className="sTradeAsset">
            <h1>{tradeDetails.asset} {tradeDetails.favorite ? '♥' : ''}</h1>
          </Col>
          <Col className="sTradeStatus">
            {tradeDetails.status === 'Win' && (<div style={{ backgroundColor: '#8fc651' }}><h6>{tradeDetails.status}</h6></div>)}
            {tradeDetails.status === 'Loss' && (<div style={{ backgroundColor: '#ce4727' }}><h6>{tradeDetails.status}</h6></div>)}
            {tradeDetails.status === 'Break Even' && (<div style={{ backgroundColor: '#0097b2' }}><h6>{tradeDetails.status}</h6></div>)}
            {tradeDetails.status === 'Undecided' && (<div style={{ backgroundColor: '#545454' }}><h6>{tradeDetails.status}</h6></div>)}
          </Col>
        </Row>
      </Container>
      <hr style={{
        height: '2px',
        backgroundColor: '#0097b2',
        color: '#0097b2',
        border: '#0097b2',
        width: '776px',
        margin: 'auto',
      }}
      />
      <Container className="sTradeStrat">
        <Row>
          <Link href={`/strategies/${strategy.firebaseKey}`} passHref>
            <h3 className="sTradeStrat">Strategy: {strategy.name}</h3>
          </Link>
        </Row>
      </Container>
      <Container className="sTradeBottom">
        <Row>
          <Container className="sTradeImg">
            <Col>
              {tradeDetails.images?.map((image) => (
                <img key={image.firebaseKey} src={image.image} alt={tradeDetails.asset} />
              ))}
            </Col>
          </Container>

          <Container className="sTradeInfo" style={{ width: '400px' }}>
            <Col>
              <div className="sTradeDetails">
                <h6>Date: {tradeDetails.date}</h6>
                <h6>Entry: ${tradeDetails.entry}</h6>
                <h6>Target: ${tradeDetails.target}</h6>
                <h6>Stop: {tradeDetails.stop}%</h6>
              </div>
              <div className="sTradeNotes">
                <p>Notes: {tradeDetails.notes}</p>
              </div>
              <div className="sTradeBtns">
                <Link href={`/trades/edit/${tradeDetails.firebaseKey}`} passHref>
                  <Button className="rounded-0 sTradeEdit" variant="primary">Edit</Button>
                </Link>
                <Button className="rounded-0" variant="outline-danger" onClick={deleteATrade}>Delete</Button>
              </div>
            </Col>
          </Container>
        </Row>
      </Container>
    </div>
  );
}
