const express = require('express')
const router = express.Router()
const { login, register, getUser, updateUser } = require('../controllers/auth')

router.post('/login', login)
router.post('/register', register)
router.get('/getuser/:id', getUser)
router.post('/updateuser/:id', updateUser)
module.exports = router
