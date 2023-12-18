import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FloatingLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck, faSquareXmark, faPenToSquare, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../utils/context/authContext';
import { newStrategy, updateStrategy } from '../../api/strategies';
import {
  createRule, deleteARule, getRulesByStratId, getSingleRule, updateRule,
} from '../../api/rules';

const initialState = {
  name: '',
  date: '',
  goalType: '',
  goal: '',
  favorite: false,
};

const ruleInitialState = {
  rule: '',
};
function StrategyForm({ strategyObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [newRules, setNewRules] = useState([]);
  const [edit, setEdit] = useState(false);
  const [rule, setRule] = useState(ruleInitialState);
  const [strategyObjRules, setStrategyObjRules] = useState([]);
  const [rulesInput, setRulesInput] = useState([]);
  const [showBtn, setShowBtn] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (strategyObj.firebaseKey) {
      setFormInput(strategyObj);
      getRulesByStratId(strategyObj.firebaseKey)?.then((rulesArray) => setStrategyObjRules(rulesArray));
    }
  }, [strategyObj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleChangeRules = (e) => {
    const { name, value } = e.target;
    setRule((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const addRuleClick = () => {
    setRulesInput((prevState) => ([...prevState, 1]));
    setShowBtn(false);
  };

  const handleSaveClick = async () => {
    createRule(rule)?.then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateRule(patchPayload)?.then(() => {
        getSingleRule(name)?.then((obj) => setNewRules((prevState) => [...prevState, obj]));
      });
    });
    setRule(ruleInitialState);
    setShowBtn(true);
    setRulesInput([]);
  };

  const handleEditClick = () => {
    deleteARule(rule.firebaseKey)?.then(() => {
      createRule(rule)?.then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateRule(patchPayload);
        getSingleRule(name)?.then((obj) => setNewRules((prevState) => [...prevState, obj]));
      });
    });
    setRule(ruleInitialState);
    setShowBtn(true);
    setRulesInput([]);
    setEdit(false);
  };

  const handleCancelClick = () => {
    setRule(ruleInitialState);
    setShowBtn(true);
    setRulesInput([]);
  };

  const deleteRule = (type, fbKey) => {
    deleteARule(fbKey);
    if (type === 'old') {
      const filterArray = strategyObjRules.filter((obj) => obj.firebaseKey !== fbKey);
      setStrategyObjRules(filterArray);
    } else {
      const filterArray = newRules.filter((obj) => obj.firebaseKey !== fbKey);
      setNewRules(filterArray);
    }
  };

  const editARule = (type, fbKey) => {
    getSingleRule(fbKey)?.then((item) => {
      setRule(item);
      setShowBtn(false);
      setEdit(true);
      setRulesInput((prevState) => ([...prevState, 1]));
      if (type === 'old') {
        const filterArray = strategyObjRules?.filter((obj) => obj.firebaseKey !== fbKey);
        setStrategyObjRules(filterArray);
      } else {
        const filterArray = newRules?.filter((obj) => obj.firebaseKey !== fbKey);
        setNewRules(filterArray);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (strategyObj.firebaseKey) {
      updateStrategy(formInput).then(() => {
        newRules?.map((item) => {
          const updatePayload = ({ firebaseKey: item.firebaseKey, strategyId: strategyObj.firebaseKey });
          return updateRule(updatePayload);
        });
      }).then(() => router.push(`/strategies/${strategyObj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      newStrategy(payload)?.then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateStrategy(patchPayload);

        newRules?.map((item) => {
          const updatePayload = ({ firebaseKey: item.firebaseKey, strategyId: name });
          return updateRule(updatePayload);
        });
        router.push(`/strategies/${name}`);
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
            className="rounded-0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date: </Form.Label>
          <Form.Control
            type="date"
            id="start"
            name="date"
            value={formInput.date}
            className="select rounded-0"
            onChange={handleChange}
          />
        </Form.Group>

        <FloatingLabel controlId="floatingSelect" label="Goal Type">
          <Form.Select
            aria-label="Goal Type"
            name="goalType"
            onChange={handleChange}
            className="mb-3 rounded-0"
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
            className="rounded-0"
            value={formInput.goal}
            onChange={handleChange}
          />
        </Form.Group>

        {(newRules || strategyObjRules) && <p>Rules:</p>}
        {strategyObjRules && strategyObjRules.map((item) => (
          <>
            <p>&#8226; {item.rule}</p>
            {!edit && (
              <>
                <FontAwesomeIcon icon={faPenToSquare} onClick={() => { editARule('old', item.firebaseKey); }} style={{ color: '#8fc651', width: '25px' }} />
                <FontAwesomeIcon icon={faTrash} onClick={() => { deleteRule('old', item.firebaseKey); }} style={{ color: '#8fc651', width: '25px' }} />
              </>
            )}
          </>
        ))}
        {newRules && newRules.map((item) => (
          <>
            <p>&#8226; {item.rule}</p>
            {!edit && (
              <>
                <FontAwesomeIcon icon={faPenToSquare} onClick={() => { editARule('new', item.firebaseKey); }} style={{ color: '#8fc651', width: '25px' }} />
                <FontAwesomeIcon icon={faTrash} onClick={() => { deleteRule('new', item.firebaseKey); }} style={{ color: '#8fc651', width: '25px' }} />
              </>
            )}

          </>
        ))}

        {rulesInput && rulesInput.map(() => (
          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="text"
                placeholder="Enter Your Rule"
                name="rule"
                value={rule.rule}
                onChange={handleChangeRules}
              />
            </Form.Group>
            {edit ? (<FontAwesomeIcon icon={faSquareCheck} onClick={handleEditClick} style={{ color: '#8fc651', width: '25px' }} />) : (<FontAwesomeIcon icon={faSquareCheck} onClick={handleSaveClick} style={{ color: '#8fc651', width: '25px' }} />)}
            {!edit && (<FontAwesomeIcon icon={faSquareXmark} onClick={handleCancelClick} style={{ color: '#8fc651', width: '25px' }} />)}
          </div>
        ))}

        {showBtn && (
        <Button variant="primary" type="button" className="rounded-0 ruleBtn" onClick={addRuleClick}>
          Add A Rule
        </Button>
        )}

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
        <Button className="rounded-0 stratSubmit" variant="primary" type="submit">
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
