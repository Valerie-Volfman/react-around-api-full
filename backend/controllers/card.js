const Card = require('../models/card');
const ServerError = require('../errors/server-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};
module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(next);
};
module.exports.getCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ServerError(404, 'No card found with that id');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new ServerError(404, 'No card found with that id');
      }
      if (card.owner.valueOf() !== req.user._id) {
        throw new ServerError(403, 'Forbidden error');
      }
      return Card.findOneAndDelete({ _id: req.params.cardId });
    })
    .then((deletedCard) => res.send({ data: deletedCard }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ServerError(404, 'No card found with that id');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ServerError(404, 'No card found with that id');
      }
      res.send(card);
    })
    .catch(next);
};
