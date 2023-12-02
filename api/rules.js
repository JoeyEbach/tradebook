import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getRulesByStratId = (strategyId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/rules.json?orderBy="strategyId"&equalTo="${strategyId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const getSingleRule = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/rules/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteARule = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/rules/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const createRule = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/rules.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateRule = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/rules/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {
  getRulesByStratId,
  getSingleRule,
  deleteARule,
  createRule,
  updateRule,
};
