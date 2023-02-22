const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
})

router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const categories = await Category.find().lean()
    const record = await Record.findOne({ _id, userId }).lean()
    categories.map(category => {
      return category.isSelected = category._id.toString() === record.categoryId.toString() // 新增屬性讓前端知道此筆資料原來的類別
    })
    record.date = record.date.toLocaleDateString('zu-ZA')
    res.render('edit', { record, categories })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    const matchCategory = await Category.findOne({ name: category })
    await Record.findOneAndUpdate({ _id, userId },
      { name, date, amount, categoryId: matchCategory._id })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    await Record.findOneAndDelete({ _id, userId })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, category, amount } = req.body
    const categories = await Category.find().lean()
    const matchCategory = categories.find(c => {
      return c.name.toString() === category
    })
    await Record.create({ name, date, categoryId: matchCategory._id, amount, userId })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router