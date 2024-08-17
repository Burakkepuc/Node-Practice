const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require('../models/Users')
const UserRoles = require("../models/UserRoles");
const Permissions = require('../models/Permissions')

const config = require('../config');

module.exports = function () {
  let strategy = new Strategy({
    strategyOrKey: config.JWT.SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, done) => {
    try {
      let user = await Users.findOne({ _id: payload.id })

      if (user) {
        let userRoles = await UserRoles.find({ user_id: payload.id })
        let permissions = await Permissions.find({ role_id: { _$in: userRoles.map(ur => ur.role_id) } })

        done(null, {
          id: user._id,
          roles: permissions,
          first_name: user.first_name,
          last_name: user.last_name,
          exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME
        })

      } else {
        done(new Error("User not found", null))
      }
    } catch (error) {
      done(error, null)
    }

  })
  passport.use(strategy)
  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false })
    }
  }
}