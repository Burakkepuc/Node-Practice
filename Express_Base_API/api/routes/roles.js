const express = require("express")
const router = express.Router()

const Roles = require('../models/Roles')
const Permissions = require('../models/Permissions')
const Response = require("../lib/Response")
const CustomError = require("../lib/Error")
const Enum = require("../config/Enum")
const permissions = require('../config/permission')
router.get('/', async (req, res) => {
  try {
    let roles = await Roles.find({})
    res.json(Response.successResponse(roles))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse.error)
  }
})

router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "role_name field must be filled !")

    if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.length === 0)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "permissions field must be an Array !")

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: req.user?.id
    })

    await role.save()

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = new Permissions({
        role_id: role._id,
        permission: body.permissions[i],
        created_by: req.user?.id
      })

      await priv.save();

    }

    res.json(Response.successResponse({ success: true }))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse.error)
  }
})

router.post("/update", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled !")

    let updates = {}

    if (body.role_name)
      updates.role_name = body.role_name
    if (typeof body.is_active === 'boolean')
      updates.is_active = body.is_active;
    console.log(body.permissions);

    if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) {
      let permissions = await Permissions.find({ role_id: body._id })
      console.log("permisions", permissions);
      let removePerm = permissions.filter(x => !body.permissions.includes(x.permission))
      console.log("RmovePerm", removePerm);
      let newPerm = body.permissions.filter(x => !permissions.map(p => p.permission).includes(x))
      console.log("New Perm: ", newPerm);

      if (removePerm.length > 0) {
        await Permissions.deleteMany({ _id: { $in: removePerm.map(x => x._id) } })
      }

      if (newPerm.length > 0) {
        for (let i = 0; i < newPerm.length; i++) {
          let priv = new Permissions({
            role_id: body._id,
            permission: newPerm[i],
            created_by: req.user?.id
          })

          await priv.save();

        }
      }
    }

    await Roles.updateOne({ _id: body._id }, updates)
    res.json(Response.successResponse({ success: true }))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse.error)
  }
})

router.post("/delete", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled !")


    await Roles.remove({ _id: body._id })
    res.json(Response.successResponse({ success: true }))
  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse.error)
  }
})

router.get("/permissions", async (req, res) => {
  res.json(permissions)
})


module.exports = router;