const express = require("express");
const router = express.Router();
const { verifyToken } = require ("../utils/validators");
const Controller = require("../controllers/product");
const  {saveMultiple} = require("../utils/gallery");

router.post("/", verifyToken , saveMultiple, Controller.add);
router.get("/:id", verifyToken, Controller.getById);
router.get('/paginate/:index', verifyToken, Controller.paginate)


module.exports = router;