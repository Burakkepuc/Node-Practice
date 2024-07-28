var express = require('express');
const Category = require('../models/Categories');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error')
const Enum = require('../config/Enum')


var router = express.Router();

router.get('/', async function (req, res) {
  try {
    let categories = await Category.find({})

    res.json(Response.successResponse(categories))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }

});

router.post('/add', async (req, res) => {
  let body = req.body;

  try {
    if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", " name fields must be filled")

    let category = new Category({
      name: body.name,
      is_active: true,
      created_by: req.user?.id
    })

    await category.save()

    res.json(Response.successResponse({ success: true }, 201))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)

  }
})


router.put('/update', async (req, res) => {
  let body = req.body;
  console.log(req.body);

  try {
    if (!body._id || !body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id or name fields  must be filled")

    let updates = {}
    for (let key in body) {
      console.log(key);
      if (body[key] && key !== '_id') {
        updates[key] = body[key]
      }
    }

    await Category.updateOne({ _id: body._id }, updates)


    res.json(Response.successResponse({ success: true }))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)

  }
})

router.delete('/delete', async (req, res) => {
  let body = req.body;
  console.log(req.body);

  try {
    const category = await Category.findOne({ _id: body._id })
    if (!category._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id fields  must be filled")

    await Category.deleteOne({ _id: body._id })


    res.json(Response.successResponse({ success: true }))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)

  }
})



module.exports = router;

