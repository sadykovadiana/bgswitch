const db = require('../../entities/Database');
const Jpeg = require('../../entities/Jpeg');

module.exports = async (req, res) => {
  try {
    const file = req.files.image;
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    const savePath = path.join(__dirname, '../db', 'uploads', fileName);
    await file.mv(savePath);
    res.redirect('/');

  } catch (error) {
    console.log(error);
    res.send('Error uploading a file');
  }

};