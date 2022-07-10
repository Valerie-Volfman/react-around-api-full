const card = require('../models/card');
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};
module.exports.getCards = (req, res) => {
  Card.find()
  .then(cards => res.send(cards))
  .catch(err => console.log(err))
}
module.exports.getCard = (req, res) => {

  Card.findById(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No card found with that id' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOne({ _id: req.params.cardId })
  .then(card => {
    if (card.owner.valueOf() === req.user._id) {
     return Card.findOneAndDelete({ _id: req.params.cardId})
    }
  })
  .then(deletedCard => res.send(deletedCard))
  .catch(err => console.log(err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )

    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No card found with that id' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )

    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No card found with that id' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};
