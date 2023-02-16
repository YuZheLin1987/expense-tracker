const mongoose = require('mongoose')
const Category = require('../category')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const categoryName = [{ name: '家居物業' }, { name: '交通出行' }, { name: '休閒娛樂' }, { name: '餐飲食品' }, { name: '其他' }]

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    await Category.create(categoryName)
    console.log('categorySeeder done!')
    process.exit()
  } catch (err) {
    console.log(err)
  }
})