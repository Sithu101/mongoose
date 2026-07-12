const path = require("path");
const fs = require("fs");

const getFilename = (filename) => {
  let modiName = new Date().valueOf() + "_" + filename;
  return modiName;
};

const getSavepath = (filename) =>
  path.join(__dirname, "../public/images", filename);

const getimagelink = (filename) => process.env.IMG_PATH + "/" + filename;

const saveSingle = async (req, res, next) => {
  let files = req.files;
  let filename = files.file.name;
  filename = getFilename(filename);
  let filepath = getSavepath(filename);
  await req.files.file.mv(filepath);
  let imgLink = getimagelink(filename);
  req.body.image = imgLink;
  next();
};

const saveMultiple = async (req, res, next) => {
  let files = req.files.files;
  let imageLinks = [];

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let filename = file.name;
    filename = getFilename(filename);
    let filepath = getSavepath(filename);
    file.mv(filepath);
    imageLinks.push(getimagelink(filename));
  }
  req.body = req.body || {};
  req.body.images = imageLinks;
  next();
};

const deleteImgByName = async (name) => {
  // if (!name) {
  //   return;
  // }
  let filePath = getSavepath(name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const deleteImgByLink = async (link) => {
  let pathAry = link.split("/");
  let name = link.split("/")[pathAry.length - 1];
  await deleteImgByName(name);
};

module.exports = {
  saveSingle,
  saveMultiple,
  deleteImgByName,
  deleteImgByLink,
};
