const db = require('../../entities/Database');

module.exports = async (req, res) => {
  const jpegId = req.params.id;

  const id = await db.remove(jpegId);

  return res.json({ id });
};