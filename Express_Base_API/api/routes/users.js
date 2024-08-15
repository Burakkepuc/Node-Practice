var express = require('express');
var router = express.Router();
var Users = require('../models/Users')
var Roles = require('../models/Roles')
var UserRoles = require('../models/UserRoles')
const Response = require('../lib/Response');
const Enum = require('../config/Enum');
const bcrypt = require('bcrypt');
const is = require('is_js');
const CustomError = require('../lib/Error');


router.get('/', async (req, res) => {
  try {
    let users = await Users.find({})
    res.json(Response.successResponse(users))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
});

router.post('/add', async (req, res) => {
  const body = req.body
  try {
    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "email field must be filled")
    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "password field must be filled")

    if (!is.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "email field must email format")
    if (body.password.length < 8) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "password field must be greater than 8 characters")
    }

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "roles field must be an array")
    }

    let roles = await Roles.find({ _id: { $in: body.roles } })
    if (roles.length === 0)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "roles field must be an array")


    let password = await bcrypt.hash(body.password, bcrypt.genSaltSync(8))

    let user = await Users.create({
      email: body.email,
      password,
      is_active: true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    })

    for (let i = 0; i < roles.length; i++) {
      await UserRoles.create({
        role_id: roles[i]._id,
        user_id: user._id
      })
    }

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED))

  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})

router.post('/update', async (req, res) => {
  try {
    let body = req.body;
    let updates = {}

    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error !", "_id fields must be filled")
    if (body.password && body.password.length >= 8)
      updates.password = await bcrypt.hash(body.password, bcrypt.genSaltSync(8))


    if (typeof body.is_active === "boolean") updates.is_active = body.is_active
    if (body.first_name) updates.first_name = body.first_name
    if (body.last_name) updates.last_name = body.last_name
    if (body.phone_number) updates.phone_number = body.phone_number

    if (Array.isArray(body.roles) && body.roles.length > 0) {
      let userRoles = await UserRoles.find({ user_id: body._id })
      console.log("🚀 ~ router.post ~ userRoles:", userRoles)
      let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id))
      console.log("🚀 ~ router.post ~ removedRoles:", removedRoles)
      let newRoles = body.roles.filter(x => !userRoles.map(r => r.role_id).includes(x))
      console.log("🚀 ~ router.post ~ newRoles:", newRoles)

      if (removedRoles.length > 0) {
        await UserRoles.deleteMany({ _id: { $in: removedRoles.map(x => x._id) } })
      }

      if (newRoles.length > 0) {
        for (let i = 0; i < newRoles.length; i++) {
          let userRole = new UserRoles({
            role_id: newRoles[i],
            user_id: body._id
          })
          await userRole.save()
        }
      }
    }



    await Users.updateOne({ _id: body._id }, updates)

    res.json(Response.successResponse({ success: true }))

  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})


router.delete('/delete', async (req, res) => {
  try {
    let body = req.body
    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error !", "_id fields must be filled")

    await Users.deleteOne({ _id: body._id })
    await UserRoles.deleteMany({ user_id: body._id })
    res.json(Response.successResponse({ success: true }))


  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})

router.post('/register', async (req, res) => {
  const body = req.body
  try {

    let user = await Users.findOne({});
    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND)
    }


    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "email field must be filled")
    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "password field must be filled")

    if (!is.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "email field must email format")
    if (body.password.length < 8) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "password field must be greater than 8 characters")
    }


    let password = await bcrypt.hash(body.password, bcrypt.genSaltSync(8))

    let createdUser = await Users.create({
      email: body.email,
      password,
      is_active: true,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    })

    let role = await Roles.create({
      role_name: "SUPER_ADMIN",
      is_active: true,
      created_by: createdUser._id
    })

    await UserRoles.create({
      user_id: createdUser._id,
      role_id: role._id
    })



    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED))

  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})


module.exports = router;

