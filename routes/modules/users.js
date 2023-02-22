const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureMessage: true
}))

router.get('/register', (req, res) =>{
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = [] // 儲存註冊資料有誤的錯誤訊息
    if (!email || !password || !confirmPassword) {
      errors.push({ message: '姓名以外的資料為必填！'})
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    // 用email檢查有無註冊過，有則註冊失敗，並回到註冊頁
    const registeredUser = await User.findOne({ email })
    if (registeredUser) {
      console.log('此信箱已經註冊過，請更換信箱')
      return res.render('register', { name, email, password ,confirmPassword })
    }

    await User.create({
      name,
      email,
      password
    })
    return res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已成功登出')
  res.redirect('/users/login')
})

module.exports = router