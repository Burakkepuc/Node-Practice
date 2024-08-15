var express = require('express');
const Response = require('../lib/Response');
const AuditLogs = require('../models/AuditLogs')
const moment = require('moment')
var router = express.Router();

router.post("/", async (req, res, next) => {
  try {

    let body = req.body;
    let query = {}
    let skip = body.limit;
    let limit = body.skip;

    if (typeof body.skip !== "numeric") {
      skip = 0
    }

    if (typeof body.limit !== "numeric" || body.limit > 500) {
      limit = 500
    }

    if (body.begin_date && body.end_date) {
      query.created_at = {
        $gte: moment(body.begin_date),
        $lte: moment(body.end_date)
      }
    } else {
      query.created_at = {
        $gte: moment().subtract(1, "day").startOf("day"),
        $lte: moment()
      }
    }

    let auditLogs = await AuditLogs.find(query).sort({ created_at: -1 }).skip(skip).limit(limit)
    res.json(Response.successResponse(auditLogs))

  } catch (error) {
    let errorResponse = Response.errorResponse(error)
    res.status(errorResponse.code).json(errorResponse)
  }
})


module.exports = router;