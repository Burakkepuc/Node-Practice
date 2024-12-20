const multer = require("multer")
const path = require("path")
const fs = require("fs")

const fileFilter = (req, file, cb) => {
  const whiteList = ["images/jpg", "image/gif", "image/jpeg", "image/png"]

  if (!whiteList.includes(file.mimetype)) {
    cb(new Error("Bu extension desteklenmemektedir. Lütfen farklı bir image extension seçiniz."), false)
  }
  cb(null, true)
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDir = path.dirname(require.main.filename)
    console.log(require.main.filename);
    fs.mkdirSync(path.join(rootDir, "public", "uploads"), { recursive: true })
    cb(null, path.join(rootDir, "public", "uploads"))
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1]

    if (!req.savedImages) req.savedImages = []

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    let url = `image_${uniqueSuffix}.${extension}`
    req.savedImages = [...req.savedImages, path.join(url)]
    cb(null, url)
  }
})

const upload = multer({ storage, fileFilter }).array("images")

module.exports = upload;