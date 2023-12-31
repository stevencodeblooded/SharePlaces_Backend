const mongoose = require('mongoose')
const uniquevalidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String },
    places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}],
})

userSchema.plugin(uniquevalidator)

module.exports = mongoose.model('User', userSchema)