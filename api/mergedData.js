import { deleteStrategy, viewStrategy } from './strategies';
import {
  deleteTrade, deleteTradeImage, getTradeImages, getTradesByStrategyId, viewTrade,
} from './trades';

const getStrategyDetails = async (firebaseKey) => {
  const strategy = await viewStrategy(firebaseKey);
  const trades = await getTradesByStrategyId(firebaseKey);

  return { ...strategy, trades };
};

const getTradeDetails = async (firebaseKey) => {
  const trade = await viewTrade(firebaseKey);
  const images = await getTradeImages(firebaseKey);

  return { ...trade, images };
};

const deleteStrategyTradeRelationship = (strategyId) => new Promise((resolve, reject) => {
  getTradesByStrategyId(strategyId).then((tradesArray) => {
    const deleteTradeImages = tradesArray.map((item) => getTradeImages(item.firebaseKey).then((images) => images.map((image) => deleteTradeImage(image.firebaseKey))));
    const deleteTradePromises = tradesArray.map((trade) => deleteTrade(trade.firebaseKey));

    Promise.all(deleteTradeImages, deleteTradePromises).then(() => {
      deleteStrategy(strategyId).then(resolve);
    });
  }).catch((error) => reject(error));
});

const deleteTradeImagesRelationship = (tradeId) => new Promise((resolve, reject) => {
  getTradeImages(tradeId).then((imagesArray) => {
    const deleteImagePromises = imagesArray.map((image) => deleteTradeImage(image.firebaseKey));

    Promise.all(deleteImagePromises).then(() => {
      deleteTrade(tradeId).then(resolve);
    });
  }).catch((error) => reject(error));
});

export {
  getStrategyDetails,
  getTradeDetails,
  deleteStrategyTradeRelationship,
  deleteTradeImagesRelationship,
};
