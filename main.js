const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const fs = require("fs").promises;
const { createReadStream, createWriteStream } = require("fs");



IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((pngFiles) => {
    const grayScalePromises = pngFiles.map((file) =>
      IOhandler.grayScale(path.join(pathUnzipped, file), path.join(pathProcessed, file))
    );
    return Promise.all(grayScalePromises);
  })
  .then(() => {
    console.log("Grayscale conversion for all PNG files is complete.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });