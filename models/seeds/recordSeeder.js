const Record = require('../record')
const Category = require('../category')
const db = require('../../config/mongoose')

const recordSeed = [
  { name: '午餐', date: '2019/04/23', amount: 60, categoryName: '餐飲食品' },
  { name: '晚餐', date: '2019/04/23', amount: 60, categoryName: '餐飲食品' },
  { name: '捷運', date: '2019/04/23', amount: 120, categoryName: '交通出行' },
  { name: '電影：驚奇隊長', date: '2019/04/23', amount: 220, categoryName: '休閒娛樂' },
  { name: '租金', date: '2015/04/01', amount: 25000, categoryName: '家居物業' },
]

db.once('open', async () => {
  try {
    await Promise.all(
      recordSeed.map(async record => {
        const { name, date, amount, categoryName } = record
        const category = await Category.findOne({ name: categoryName })
        await Record.create({
          name,
          date,
          amount,
          categoryId: category._id
        })
      })
    )
    console.log('recordSeeder done!')
    process.exit()
  } catch(err) {
    console.log(err)
  }
})