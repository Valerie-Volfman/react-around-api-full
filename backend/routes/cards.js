const express = require('express');

const router = express.Router();
const {
  getCard, getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/cards', getCards);
router.get('/cards/:cardId', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
