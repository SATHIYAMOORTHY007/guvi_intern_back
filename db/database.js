const mongoose = require('mongoose')

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log('db connected')
  } catch (err) {
    console.error(err)
  }
}

module.exports = connectdb
