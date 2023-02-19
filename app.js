const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Category = require('./models/category')
const Record = require('./models/record')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

app.get('/records/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { categories })
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
  const categories = await Category.find().lean()
  const records = await Record.find().lean()

  const updateRecords = records.map(record => {
    const matchCategory = categories.find(category => {
      return category._id.toString() === record.categoryId.toString()
    })
    record.date = record.date.toLocaleDateString('zu-ZA')
    record.icon = matchCategory.icon
    return record
  })
  res.render('index', { updateRecords, categories })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})