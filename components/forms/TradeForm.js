import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getTradeImages, newTrade, updateTrade } from '../../api/trades';

const initialState = {
  asset: '',
  date: '',
  entry: '',
  favorite: false,
  stop: '',
  status: '',
  target: '',
  notes: '',
};
function TradeForm({ tradeObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { firebaseKey } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (tradeObj.firebaseKey) {
      getTradeImages(tradeObj.firebaseKey).then(setImages);
      setFormInput(tradeObj);
    }
  }, [tradeObj, images, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tradeObj.firebaseKey) {
      updateTrade(formInput).then(() => router.push(`/trades/${tradeObj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid, strategyId: firebaseKey };
      newTrade(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateTrade(patchPayload).then(() => router.push(`/trades/${name}`));
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Asset Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Asset Name"
            name="asset"
            value={formInput.asset}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Date of Trade"
            name="date"
            value={formInput.date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Entry</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Entry Price"
            name="entry"
            value={formInput.entry}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Target</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Target Price"
            name="target"
            value={formInput.target}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Stop %</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Stop Percentage"
            name="stop"
            value={formInput.stop}
            onChange={handleChange}
          />
        </Form.Group>

        <FloatingLabel controlId="floatingSelect" label="Trade Status">
          <Form.Select
            aria-label="Trade Status"
            name="status"
            onChange={handleChange}
            className="mb-3"
            value={formInput.status}
            required
          >
            <option value="">Select the Trade Status</option>
            <option>Win</option>
            <option>Loss</option>
            <option>Break Even</option>
            <option>Undecided</option>
          </Form.Select>
        </FloatingLabel>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Trade Notes</Form.Label>
          <Form.Control
            type="textarea"
            placeholder="Enter Trade Notes"
            name="notes"
            value={formInput.notes}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="switch"
            label="Favorite"
            name="favorite"
            checked={formInput.favorite}
            onChange={(e) => {
              setFormInput((prevState) => ({
                ...prevState,
                favorite: e.target.checked,
              }));
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

TradeForm.propTypes = {
  tradeObj: PropTypes.shape({
    asset: PropTypes.string,
    date: PropTypes.string,
    firebaseKey: PropTypes.string,
    entry: PropTypes.string,
    favorite: PropTypes.bool,
    uid: PropTypes.string,
    stop: PropTypes.string,
    status: PropTypes.string,
    target: PropTypes.string,
    notes: PropTypes.string,
    strategyId: PropTypes.string,
  }),

};
TradeForm.defaultProps = {
  tradeObj: initialState,
};

export default TradeForm;
