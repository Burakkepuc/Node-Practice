const express = require('express')
const router = express.Router()

const auth = require('./auth.routes')
const upload = require('../utils/upload')
const multer = require('multer')
const APIError = require('../utils/errors')
const Response = require('../utils/response')

router.use(auth)


router.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        throw new APIError("Resim yüklenirken multer kaynaklı hata çıktı: " + err.message, 500);
      } else if (err) {
        throw new APIError("Resim yüklenirken hata çıktı: " + err.message, 400);
      } else {
        console.log(req.savedImages);
        return new Response(req.savedImages, "Yükleme Başarılı").success(res);
      }
    } catch (error) {
      throw new APIError(error.message, 500)
    }
  });
});

module.exports = router;
