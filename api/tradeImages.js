import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getTradeImages = (tradeId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/images.json?orderBy="tradeId"&equalTo="${tradeId}"`, {
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

const viewTradeImage = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/images/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const newTradeImage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/images.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteTradeImage = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/images/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const updateTradeImage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/images/${payload.firebaseKey}.json`, {
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
  getTradeImages,
  deleteTradeImage,
  newTradeImage,
  updateTradeImage,
  viewTradeImage,
};
