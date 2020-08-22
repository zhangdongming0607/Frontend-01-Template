var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.post("/", function (req, res, next) {
  fs.writeFileSync(`./week19/public/${req.query.filename}`, req.body.content);  res.end()
});

module.exports = router;
