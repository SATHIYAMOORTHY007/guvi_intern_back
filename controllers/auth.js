const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const login = async (req, res) => {
  try {
    //check the user
    const user = await User.findOne({ email: req.body.email }).exec()

    //if user is not
    if (!user) return res.status(404).json({ message: 'user not found' })

    //comparing the password
    const isPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isPassword)
      return res.status(404).json({ message: 'password not match' })

    const token = jwt.sign({ id: user._id }, process.env.jwt)

    return res
      .cookie('token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ user, token })
  } catch (err) {
    return res.sendStatus(400)
  }
}
const register = async (req, res) => {
  let d = new Date().setMilliseconds(0, 10)
  try {
    const { email, name, password, cpassword } = req.body

    if (!name || !password || !email || !cpassword)
      return res.status(400).send({ message: 'all fields required' })

    //duplicated email
    const duplicate = await User.findOne({ email: email }).exec()
    if (duplicate)
      return res.status(401).json({ message: 'already existing..' })

    //password hashing
    const hashpwd = await bcrypt.hash(password, 4)

    const result = await User.create({
      email: email,
      name: name,
      dateofbirth: d,
      password: hashpwd,
    })
    //generated token

    res.send({ message: ` created ` })
  } catch (err) {
    console.log(err)
  }
}

const getUser = async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById({ _id: id })

    if (!user) return res.sendStatus(404)
    return res.json({ message: user })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
const updateUser = async (req, res) => {
  const id = req.params.id

  const { name, email, date, age, gender, phone, course } = req.body

  try {
    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      dateofbirth: date,
      age,
      gender,
      phone,
      course,
    })
    await user.save()
    if (!user) return res.Status(404)
    return res.json({ message: user })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
module.exports = { login, register, getUser, updateUser }
