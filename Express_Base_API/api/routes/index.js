const fs = require("fs");

var express = require('express');
var router = express.Router();


let routes = fs.readdirSync(__dirname)

for (let route of routes) {
  if (route.includes(".js") && route !== "index.js") {
    const routeName = route.slice(0, -3);
    router.use(`/${routeName}`, require(`./${routeName}`))
  }
}


module.exports = router;



