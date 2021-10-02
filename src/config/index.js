const path = require('path');

const dbFolder = path.resolve(__dirname, '../../db/');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const uploadsFolder = path.resolve(dbFolder, 'uploads');
const views = path.resolve(__dirname, '../views');
const temp = path.resolve(__dirname, '../../tmp');

module.exports = {
  PORT: 8080,

  dbFolder,
  dbDumpFile,
  uploadsFolder,
  views,
  temp,
};
