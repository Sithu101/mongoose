const express = require("express");
const router = express.Router();
const Controller = require("../controllers/cat");
const { verifyToken } = require("../utils/validators");
const { saveSingle, saveMultiple } = require("../utils/gallery");

router.get("/", verifyToken, Controller.all);
router.post("/", verifyToken, saveSingle, Controller.add);

router
  .route("/:id")
  .get(verifyToken, Controller.getById)
  .patch(verifyToken, Controller.modify)
  .delete(verifyToken, Controller.remove);

module.exports = router;
