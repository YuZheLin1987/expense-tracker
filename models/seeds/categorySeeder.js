const mongoose = require('mongoose')
const Category = require('../category')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const categoryList = [
  { name: '家居物業', icon: "fa-solid fa-house" }, 
  { name: '交通出行', icon: "fa-solid fa-van-shuttle" }, 
  { name: '休閒娛樂', icon: "fa-solid fa-face-grin-beam" }, 
  { name: '餐飲食品', icon: "fa-solid fa-utensils" }, 
  { name: '其他', icon: "fa-solid fa-pen" }
]

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    await Category.create(categoryList)
    console.log('categorySeeder done!')
    process.exit()
  } catch (err) {
    console.log(err)
  }
})