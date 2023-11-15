import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteStrategyTradeRelationship, getStrategyDetails } from '../api/mergedData';

function StrategyCard({ strategyObj }) {
  const [tradeNumber, setTradesNumber] = useState();
  const router = useRouter();

  const numberOfTrades = () => {
    getStrategyDetails(strategyObj.firebaseKey).then((obj) => setTradesNumber(obj.trades.length));
  };

  const deleteAStrategy = () => {
    if (window.confirm(`Are you sure you want to delete ${strategyObj.name}?`)) {
      deleteStrategyTradeRelationship(strategyObj.firebaseKey).then(() => router.push('/strategies'));
    }
  };

  useEffect(() => {
    numberOfTrades();
  }, []);

  return (
    <>
      <Card>
        {strategyObj.favorite ? '♥' : ''}
        <Card.Header>{strategyObj.name}</Card.Header>
        <Card.Body>
          <p>{strategyObj.date}</p>
          <h3>{strategyObj.goalType}</h3>
          <h6>{tradeNumber}</h6>
          <Link href={`/strategies/${strategyObj.firebaseKey}`} passHref>
            <Button variant="primary">View</Button>
          </Link>
          <Link href={`/strategies/edit/${strategyObj.firebaseKey}`} passHref>
            <Button variant="primary">Edit</Button>
          </Link>
          <Button variant="outline-danger" onClick={deleteAStrategy}>Delete</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    </>
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
