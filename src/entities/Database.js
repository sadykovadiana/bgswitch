const { EventEmitter } = require('events');
const { existsSync } = require('fs');
const { dbDumpFile } = require('../config');
const { writeFile } = require('../utils/fs');
const { prettifyJsonToString } = require('../utils/prettifyJsonToString');
const Jpeg = require('./Jpeg');

class Database extends EventEmitter {
  constructor() {
    super();

    this.idToJpeg = {};
  }

  async initFromDump() {
    if (existsSync(dbDumpFile) === false) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump === 'object') {
      this.idToJpeg = {};

      for (const key in dump) {
        const jpeg = dump[key];
        const { id, createdAt, size } = jpeg;
        this.idToJpeg[id] = new Jpeg({id, createdAt, size});
      }
    }
  }

  async insert(jpeg, file) {
    await jpeg.saveOriginal(file);

    this.idToJpeg[jpeg.id] = jpeg;

    this.emit('changed');
  }

  async remove(jpegId) {
    const jpegRaw = this.idToJpeg[jpegId];

    if(jpegRaw){
      const { id, createdAt, size } = jpegRaw;
      const jpeg = new Jpeg({id, createdAt, size});

      await jpeg.removeOriginal();

      delete this.idToJpeg[jpegId];

      this.emit('changed');

      return jpegId;
    }

  }

  findOne(jpegId) {
    const jpegRaw = this.idToJpeg[jpegId];

    if (!jpegRaw) {
      return null;
    }

    const { id, createdAt, size } = jpegRaw;
    const jpeg = new Jpeg({id, createdAt, size});

    return jpeg;
  }

  find() {
    let allJpegs = Object.values(this.idToJpeg);

    allJpegs.sort((jpegA, jpegB) => jpegB.createdAt - jpegA.createdAt);

    return allJpegs;
  }

  toJSON() {
    return this.idToJpeg;
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', () => {
  writeFile(dbDumpFile, prettifyJsonToString(db.idToJpeg));
});

module.exports = db;