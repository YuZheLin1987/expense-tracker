const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const user = require('../user')

const SEED_USER = {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}

const SEED_RECORDS = [
  { name: '午餐', date: '2019/04/23', amount: 60, categoryName: '餐飲食品' },
  { name: '晚餐', date: '2019/04/23', amount: 60, categoryName: '餐飲食品' },
  { name: '捷運', date: '2019/04/23', amount: 120, categoryName: '交通出行' },
  { name: '電影：驚奇隊長', date: '2019/04/23', amount: 220, categoryName: '休閒娛樂' },
  { name: '租金', date: '2015/04/01', amount: 25000, categoryName: '家居物業' },
  { name: '電話費', date: '2020/09/02', amount: 599, categoryName: '其他' },
  { name: '晚餐', date: '2020/09/10', amount: 145, categoryName: '餐飲食品' },
  { name: 'goshare', date: '2020/08/29', amount: 43, categoryName: '交通出行' },
  { name: '飲料', date: '2020/09/08', amount: 80, categoryName: '餐飲食品' },
  { name: '羽球', date: '2020/09/21', amount: 350, categoryName: '休閒娛樂' },
  { name: '羽球', date: '2020/09/28', amount: 350, categoryName: '休閒娛樂' },
  { name: '加油', date: '2020/09/11', amount: 127, categoryName: '交通出行' }
]

db.once('open', async () => {
  try {
    const { name, email, password } = SEED_USER
    const categories = await Category.find().lean()
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    await User.create({
      name,
      email,
      password: hashPassword
    })
    .then(async user => {
      const userId = user._id.toString()
      SEED_RECORDS.map(async record => {
        const matchCategory = categories.find(c => {
          return c.name.toString() === record.categoryName.toString()
        })
        record.categoryId = matchCategory._id.toString()
        record.userId = userId
        delete record.categoryName
        return record
      })
      await Record.create(SEED_RECORDS)
      return
    })
    .then(() => {
      console.log('recordSeeder done!')
      process.exit()
    })
  } catch(err) {
    console.log(err)
  }
})