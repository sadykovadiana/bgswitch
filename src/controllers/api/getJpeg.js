const db = require('../../entities/Database');

module.exports = async (req, res) => {
  const jpegId = req.params.id;

  return res.json(db.findOne(jpegId).toJSON());
};