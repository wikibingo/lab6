/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");
const AdmZip = require("adm-zip");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((res, rej) => {
    try {
      const zip = new AdmZip(pathIn);
      zip.extractAllTo(pathOut, true);
      res("Extraction operation complete");
    } catch (error) {
      rej(error);
    }
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, files) => {
      if(err) {
        rej(err)
      } else {
        const pngFiles = files.filter(file => path.extname(file) === '.png')
        // .map(file => path.join('unzipped', file));
        res(pngFiles);
      }
    })
  })
}



/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((res, rej) => {
    fs.createReadStream(pathIn)
    .pipe(
      new PNG()
    )
    .on("parsed", function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = (this.width * y + x) << 2;
          const red = this.data[idx]; 
          const green = this.data[idx + 1]; 
          const blue = this.data[idx + 2];
          const grey = (red + green + blue) / 3;
          this.data[idx] = grey;
          this.data[idx + 1] = grey;
          this.data[idx + 2] = grey;
          }
        }
        this.pack().pipe(fs.createWriteStream(pathOut))
        .on("finish", () => {
          res("Grayscale conversion complete");
        })
        .on("error", (error) => {
          rej(error);
        });
    });
});
};


module.exports = {
  unzip,
  readDir,
  grayScale,
};
