const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  // 本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) return done(null, false, { message: '這個信箱沒有註冊過'})
      if (user.password !== password) return done(null, false, { message: '密碼錯誤！' })
      return done(null, user)
    } catch(err) {
      done(err, false)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById({ id }).lean()
      return done(null, user)
    } catch(err) {
      done(err, null)
    }
  })
}