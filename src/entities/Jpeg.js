const path = require('path');

const { uploadsFolder } = require('../config');
const { removeFile } = require('../utils/fs');
const { generateId } = require('../utils/generateId');

module.exports = class Jpeg {
  constructor(props) {
    const { id, createdAt, size } = props;
    this.id = id || generateId();
    this.createdAt = createdAt || Date.now();
    this.size = size;
    this.originalFilename = `${this.id}_original.jpeg`;
  }

  async saveOriginal(content) {
    const savePath = path.join(uploadsFolder, this.originalFilename);
    await content.mv(savePath);
  }

  async removeOriginal() {
    await removeFile(path.resolve(uploadsFolder, this.originalFilename));
  }

  toPublicJSON() {
    return {
      id: this.id,
      originalUrl: `/files/${this.id}_original.jpeg`,
      createdAt: this.createdAt,
      size: this.size,
    };
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      size: this.size,
    };
  }
};
