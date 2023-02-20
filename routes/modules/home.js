const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/filter', async (req, res) => {
  try {
    const selectCategoryName = req.query.filterSelect

    if (selectCategoryName === 'none') return res.redirect('/') // 選到“類別”就導回首頁

    let totalAmount = 0
    const categories = await Category
      .find()
      .lean()
    const selectCategory = categories.find(category => {
      return category.name === selectCategoryName
    })
    // 只撈出指定類別的紀錄
    const records = await Record
      .find({ categoryId: selectCategory._id })
      .lean()

    categories.map(category => {
      return category.isSelected = category.name === selectCategoryName // 新增屬性讓前端知道現在所選的類別為何
    })

    if (records.length === 0) return res.render('noResult', { categories }) // 沒有指定類別資料導至noResult頁面

    const updateRecords = records.map(record => {
      totalAmount += record.amount
      record.date = record.date.toLocaleDateString('zu-ZA')
      record.icon = selectCategory.icon
      return record
    })

    res.render('index', { updateRecords, categories, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

router.get('/', async (req, res) => {
  try {
    let totalAmount = 0 // 計算總金額
    const categories = await Category.find().lean()
    const records = await Record.find().lean()

    if (records.length === 0) {
      const noRecord = true
      return res.render('noResult', { categories, noRecord }) // 沒有任何資料導至noResult頁面
    }

    // 更新record資料
    const updateRecords = records.map(record => {
      totalAmount += record.amount
      const matchCategory = categories.find(category => {
        return category._id.toString() === record.categoryId.toString()
      })
      record.date = record.date.toLocaleDateString('zu-ZA')
      record.icon = matchCategory.icon
      return record
    })
    res.render('index', { updateRecords, categories, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router