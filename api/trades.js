import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getTrades = (uid) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades.json?orderBy="uid"&equalTo="${uid}"`, {
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

const getTradesByStrategyId = (strategyId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades.json?orderBy="strategyId"&equalTo="${strategyId}"`, {
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

const newTrade = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateTrade = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteTrade = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const viewTrade = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/trades/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

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

export {
  getTrades,
  getTradesByStrategyId,
  newTrade,
  updateTrade,
  deleteTrade,
  viewTrade,
  getTradeImages,
  deleteTradeImage,
};
