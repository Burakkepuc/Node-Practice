const whiteList = ["http://localhost:5000"]

const corsOptions = (req, callback) => {
  let corstOptions;

  if (whiteList.includes(req.header("Origin"))) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}



module.exports = corsOptions;