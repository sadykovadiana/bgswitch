const db = require('../../entities/Database');

module.exports = (req, res) => {
  const allJpegs = db.find().map((jpeg) => jpeg.toPublicJSON());

  return res.json({ ...allJpegs });
};