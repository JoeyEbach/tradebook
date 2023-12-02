/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  faEye, faPenToSquare, faTrash, faSquareFull, faCrown,
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

  const deleteATrade = () => {
    if (window.confirm(`Are you sure you want to delete this ${tradeObj.asset} trade?`)) {
      deleteTradeImagesRelationship(tradeObj.firebaseKey);
    }
  };

  useEffect(() => {
    getTradeImages();
  }, [tradeObj]);

  return (
    <Container>

      {tradeObj.favorite ? <FontAwesomeIcon icon={faCrown} className="favIcon" /> : ''}
      <Card className="tradeCard rounded-0">
        <Row>
          <Col xs={1}>
            {tradeObj.status === 'Win' && <FontAwesomeIcon icon={faSquareFull} className="statusBar" style={{ color: '#8fc651' }} />}
            {tradeObj.status === 'Loss' && <FontAwesomeIcon icon={faSquareFull} className="statusBar" style={{ color: '#ce4727' }} />}
            {tradeObj.status === 'Break Even' && <FontAwesomeIcon icon={faSquareFull} className="statusBar" style={{ color: '#0097b2' }} />}
            {tradeObj.status === 'Undecided' && <FontAwesomeIcon icon={faSquareFull} className="statusBar" style={{ color: '#858080' }} />}
          </Col>
          <Col xs={4}>
            <CardImg src={tradeImages && tradeImages[0]?.image} alt={tradeObj.asset} className="rounded-0" />
          </Col>
          <Col xs={4}>
            <div className="tradeAsset">
              <h3>{tradeObj.asset}</h3>
              <p>{tradeObj.date}</p>
            </div>
          </Col>
          <Col>
            <div className="tradeCardInfo">
              <p>Entry: {tradeObj.entry}</p>
              <p>Target: {tradeObj.target}</p>
              <p>Stop: {tradeObj.stop}</p>
            </div>
          </Col>
          <div className="tradeIcons">
            <Link href={`/trades/${tradeObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faEye} className="icon" />
            </Link>
            <Link href={`/trades/edit/${tradeObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faPenToSquare} className="icon" />
            </Link>
            <FontAwesomeIcon icon={faTrash} onClick={deleteATrade} className="icon" />
          </div>
        </Row>

      </Card>
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
