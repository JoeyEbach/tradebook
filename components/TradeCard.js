/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  faEye, faPenToSquare, faTrash, faCrown,
} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CardImg } from 'react-bootstrap';
import { deleteTradeImagesRelationship, getTradeDetails } from '../api/mergedData';

function TradeCard({ tradeObj }) {
  const [tradeImages, setTradeImages] = useState([]);

  const getTradeImages = () => {
    getTradeDetails(tradeObj.firebaseKey).then((obj) => setTradeImages(obj.images));
  };

  const deleteATrade = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete this ${tradeObj.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeObj.firebaseKey);
    }
  };

  useEffect(() => {
    getTradeImages();
  }, [tradeObj]);

  return (
    <Container>
      <Link href={`/trades/${tradeObj.firebaseKey}`} passHref>
        <Card className="tradeCard rounded-0">

          <div className="status">
            {tradeObj.status === 'Win' && <div className="statusBar" style={{ backgroundColor: '#8fc651' }} />}
            {tradeObj.status === 'Loss' && <div className="statusBar" style={{ backgroundColor: '#ce4727' }} />}
            {tradeObj.status === 'Break Even' && <div className="statusBar" style={{ backgroundColor: '#0097b2' }} />}
            {tradeObj.status === 'Undecided' && <div className="statusBar" style={{ backgroundColor: '#858080' }} />}
          </div>
          <Row>
            <Col xs={4}>
              <CardImg src={tradeImages && tradeImages[0]?.image} alt={tradeObj.asset} className="rounded-0" />
            </Col>
            {tradeObj.favorite ? <FontAwesomeIcon icon={faCrown} className="fIcon" /> : ''}
            <Col xs={4}>
              <div className="tradeAsset">
                <h3>{tradeObj.asset}</h3>
                <p>{tradeObj.date}</p>
              </div>
            </Col>
            <Col>
              <div className="tradeCardInfo">
                <p>Entry: ${tradeObj.entry}</p>
                <p>Target: ${tradeObj.target}</p>
                <p>Stop: {tradeObj.stop}%</p>
              </div>
            </Col>
            <div className="icons">
              <Link href={`/trades/${tradeObj.firebaseKey}`} passHref>
                <FontAwesomeIcon icon={faEye} className="icon" />
              </Link>
              <Link href={`/trades/edit/${tradeObj.firebaseKey}`} passHref>
                <FontAwesomeIcon icon={faPenToSquare} className="icon" />
              </Link>
              <FontAwesomeIcon icon={faTrash} onClick={deleteATrade} className="icon delIcon" />
            </div>
          </Row>

        </Card>
      </Link>
    </Container>
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
