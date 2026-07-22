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
  try {
    console.log('saveMultiple called, req.body keys:', Object.keys(req.body || {}));
    console.log('saveMultiple files keys:', req.files ? Object.keys(req.files) : null);

    let files = req.files && req.files.files;
    if (!files) {
      console.log('No files provided to saveMultiple');
      return next();
    }

    if (!Array.isArray(files)) {
      files = [files];
    }

    let imageLinks = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let filename = file.name;
      filename = getFilename(filename);
      let filepath = getSavepath(filename);
      try {
        await file.mv(filepath);
      } catch (mvErr) {
        console.error('Error moving file', mvErr);
        return next(mvErr);
      }
      imageLinks.push({ link: getimagelink(filename), desc: "Images" + i });
    }
    req.body.images = imageLinks;
    next();
  } catch (err) {
    console.error('saveMultiple error:', err);
    next(err);
  }
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
