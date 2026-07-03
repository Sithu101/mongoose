const path = require("path");

const genFilename = (filename) => {
  let modiName = new Date().valueOf() + "_" + filename;
  return modiName;
};

const getSavepath = (filename) =>
  path.join(__dirname, "../public/images", filename);

const getimagelink = (filename) => process.env.IMG_PATH + "/" + filename;

const saveSingle = async (req, res, next) => {
  let files = req.files;
  let filename = files.file.name;
  filename = genFilename(filename);
  let filepath = getSavepath(filename);
  req.files.file.mv(filepath);
  let imgLink = getimagelink(filename);
  req.imageLink = imgLink;
  next();
};

module.exports = {
  saveSingle,
};
