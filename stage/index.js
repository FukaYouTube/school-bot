const Stage = require('telegraf/stage')
const stage = new Stage()

stage.register(require('./opros'))

module.exports = stage