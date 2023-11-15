/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { deleteTradeImagesRelationship, getTradeDetails } from '../api/mergedData';

function TradeCard({ tradeObj }) {
  const [tradeImages, setTradeImages] = useState([]);
  const router = useRouter();

  const getTradeImages = () => {
    getTradeDetails(tradeObj.firebaseKey).then((obj) => setTradeImages(obj.images));
  };

  const deleteATrade = () => {
    if (window.confirm(`Are you sure you want to delete this ${tradeObj.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeObj.firebaseKey).then(() => router.push('/trades'));
    }
  };

  useEffect(() => {
    getTradeImages();
  }, []);

  return (
    <>
      <Card>
        {tradeObj.status}
        <Card.Header>{tradeObj.favorite ? '♥' : ''} {tradeObj.asset} | {tradeObj.date}</Card.Header>
        <Card.Body>
          <img src={tradeImages[0]} alt={tradeObj.asset} />
          <p>{tradeObj.entry}</p>
          <p>{tradeObj.target}</p>
          <p>{tradeObj.stop}</p>
          <Link href={`/trades/${tradeObj.firebaseKey}`} passHref>
            <Button variant="primary">View</Button>
          </Link>
          <Link href={`/trades/edit/${tradeObj.firebaseKey}`} passHref>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="outline-danger" onClick={deleteATrade}>Delete</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    </>
  );
}

TradeCard.propTypes = {
  tradeObj: PropTypes.shape({
    date: PropTypes.string,
    asset: PropTypes.string,
    entry: PropTypes.string,
    stop: PropTypes.string,
    status: PropTypes.string,
    target: PropTypes.string,
    notes: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

export default TradeCard;
