const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Category = require('./models/category')
const Record = require('./models/record')
const record = require('./models/record')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false })
const port = 3000

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/records/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
})

app.get('/records/:id/edit', async (req, res) => {
  try {
    const id = req.params.id
    const categories = await Category.find().lean()
    const record = await Record.findById(id).lean()
    const matchCategory = categories.find(category => {
      return category._id.toString() === record.categoryId.toString()
    })
    record.date = record.date.toLocaleDateString('zu-ZA')
    res.render('edit', { record, categories, matchCategory })
  } catch (err) {
    console.log(err)
  }
})

app.put('/records/:id', async (req, res) => {
  try {
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    const matchCategory = await Category.findOne({ name: category })
    await Record.findOneAndUpdate({ _id }, 
      { name, date, amount, categoryId: matchCategory._id })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

app.delete('/records/:id', async (req, res) => {
  try {
    const _id = req.params.id
    await Record.findOneAndDelete({ _id })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

app.post('/records', async (req, res) => {
  try {
    const { name, date, category, amount } = req.body
    const categories = await Category.find().lean()
    const matchCategory = categories.find(c => {
      return c.name.toString() === category
    })
    await Record.create({ name, date, categoryId: matchCategory._id, amount })
    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

app.get('/', async (req, res) => {
  try {
    const categories = await Category.find().lean()
    const records = await Record.find().lean()
    let totalAmount = 0
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

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})