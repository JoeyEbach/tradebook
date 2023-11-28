/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteTradeImagesRelationship, getTradeDetails } from '../api/mergedData';

function TradeCard({ tradeObj }) {
  const [tradeImages, setTradeImages] = useState([]);

  const getTradeImages = () => {
    getTradeDetails(tradeObj.firebaseKey).then((obj) => setTradeImages(obj.images));
  };

  const deleteATrade = () => {
    if (window.confirm(`Are you sure you want to delete this ${tradeObj.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeObj.firebaseKey);
    }
  };

  useEffect(() => {
    getTradeImages();
  }, [tradeObj]);

  return (
    <>
      <Card className="tradeCard">
        {tradeObj.status}
        <Card.Header>{tradeObj.favorite ? '♥' : ''} {tradeObj.asset} | {tradeObj.date}</Card.Header>
        <Card.Body>
          <img src={tradeImages && tradeImages[0]?.image} alt={tradeObj.asset} />
          <p>Entry: {tradeObj.entry}</p>
          <p>Target: {tradeObj.target}</p>
          <p>Stop: {tradeObj.stop}</p>
          <div className="icons">
            <Link href={`/trades/${tradeObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faEye} className="icon" />
            </Link>
            <Link href={`/trades/edit/${tradeObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faPenToSquare} className="icon" />
            </Link>
            <FontAwesomeIcon icon={faTrash} onClick={deleteATrade} className="icon" />
          </div>
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
