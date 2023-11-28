import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { newStrategy, updateStrategy } from '../../api/strategies';

const initialState = {
  name: '',
  date: '',
  goalType: '',
  goal: '',
  favorite: false,
};
function StrategyForm({ strategyObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (strategyObj.firebaseKey) setFormInput(strategyObj);
  }, [strategyObj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (strategyObj.firebaseKey) {
      updateStrategy(formInput).then(() => router.push(`/strategies/${strategyObj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      newStrategy(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateStrategy(patchPayload).then(() => router.push(`/strategies/${name}`));
      });
    }
  };

  return (
    <div className="stratFormCont">
      <Form className="stratForm" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Strategy Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Strategy Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Start Date"
            name="date"
            value={formInput.date}
            onChange={handleChange}
          />
        </Form.Group>

        <FloatingLabel controlId="floatingSelect" label="Goal Type">
          <Form.Select
            aria-label="Goal Type"
            name="goalType"
            onChange={handleChange}
            className="mb-3"
            value={formInput.goalType}
            required
          >
            <option value="">Select a Goal Type</option>
            <option>Time Based</option>
            <option>Profit Based</option>
            <option>Number of Trades</option>
          </Form.Select>
        </FloatingLabel>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Goal</Form.Label>
          <Form.Control
            type="textarea"
            placeholder="Enter Your Goal"
            name="goal"
            value={formInput.goal}
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
          {strategyObj.firebaseKey ? 'Update Strategy' : '+ New Strategy'}
        </Button>
      </Form>
    </div>
  );
}

StrategyForm.propTypes = {
  strategyObj: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    goalType: PropTypes.string,
    goal: PropTypes.string,
    favorite: PropTypes.bool,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

StrategyForm.defaultProps = {
  strategyObj: initialState,
};

export default StrategyForm;
