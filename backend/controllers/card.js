const Card = require('../models/card');
const FoundError = require('../errors/found-err');

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
        throw new FoundError(404, 'No card found with that id');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new FoundError(404, 'No card found with that id');
      }
      if (card.owner.valueOf() !== req.user._id) {
        throw new FoundError(403, 'Forbidden error');
      }
      return Card.findOneAndDelete({ _id: req.params.cardId });
    })
    .then((deletedCard) => res.send({ data: deletedCard }))
    .catch(next);
};

module.exports.likeCard = (req, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new FoundError(404, 'No card found with that id');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new FoundError(404, 'No card found with that id');
      }
    })
    .catch(next);
};
