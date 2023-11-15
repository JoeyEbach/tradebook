/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, NavLink } from 'react-bootstrap';
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
      viewStrategy(obj.strategyId).then(setStrategy);
    });
  };

  const deleteATrade = () => {
    if (window.confirm(`Are you sure you want to delete this ${tradeDetails.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeDetails.firebaseKey).then(() => router.push('/trades'));
    }
  };

  useEffect(() => {
    getTrade();
  }, []);

  return (
    <div>
      <h1>Asset: {tradeDetails.asset} {tradeDetails.favorite ? '♥' : ''}</h1>
      <NavLink href={`/strategies/${strategy.firebaseKey}`} passHref>
        <h3>Strategy: {strategy.name}</h3>
      </NavLink>
      <h5>Date: {tradeDetails.date}</h5>
      <h4>{tradeDetails.status}</h4>
      <h6>Entry: {tradeDetails.entry}</h6>
      <h6>Target: {tradeDetails.target}</h6>
      <h6>Stop: {tradeDetails.stop}</h6>
      <p>Notes: {tradeDetails.notes}</p>

      {tradeDetails.images?.map((image) => (
        <img key={image.firebaseKey} src={image} alt={tradeDetails.asset} />
      ))}
      <Link href={`/trades/edit/${tradeDetails.firebaseKey}`} passHref>
        <Button variant="primary">Edit</Button>
      </Link>
      <Button variant="outline-danger" onClick={deleteATrade}>Delete</Button>
    </div>
  );
}
