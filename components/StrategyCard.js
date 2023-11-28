import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import Link from 'next/link';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  faEye, faPenToSquare, faTrash, faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { deleteStrategyTradeRelationship, getStrategyDetails } from '../api/mergedData';

function StrategyCard({ strategyObj }) {
  const [tradeNumber, setTradesNumber] = useState();

  const numberOfTrades = () => {
    getStrategyDetails(strategyObj.firebaseKey).then((obj) => setTradesNumber(obj.trades.length));
  };

  const deleteAStrategy = () => {
    if (window.confirm(`Are you sure you want to delete ${strategyObj.name}?`)) {
      deleteStrategyTradeRelationship(strategyObj.firebaseKey);
    }
  };

  useEffect(() => {
    numberOfTrades();
  }, [strategyObj]);

  return (
    <div>
      <Card className="strategyCard">
        <Card.Body>
          {strategyObj.favorite ? <FontAwesomeIcon icon={faCrown} className="favIcon" /> : ''}
          <div className="stratCardCont">
            <div className="stratHead">
              <h1>{strategyObj.name}</h1>
            </div>
            <div className="stratInfo">
              <p>Date: {strategyObj.date}</p>
              <p>Goal Type: {strategyObj.goalType}</p>
              <p>Trades: {tradeNumber}</p>
            </div>
          </div>
          <div className="icons">
            <Link href={`/strategies/${strategyObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faEye} className="icon" />
            </Link>
            <Link href={`/strategies/edit/${strategyObj.firebaseKey}`} passHref>
              <FontAwesomeIcon icon={faPenToSquare} className="icon" />
            </Link>
            <FontAwesomeIcon icon={faTrash} onClick={deleteAStrategy} className="icon delIcon" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

StrategyCard.propTypes = {
  strategyObj: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    goalType: PropTypes.string,
    goal: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

export default StrategyCard;
