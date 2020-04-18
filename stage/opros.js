const Wizard = require('telegraf/scenes/wizard')

const User = require('../model/user.model')

const { keyboard } = require('telegraf/markup')

const fs = require('fs')
const yamlParser = require('yaml-parser')
const i18n = new yamlParser.YamlParser()

const wizardScene = new Wizard('opros', ctx => {
    
    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    let opros_message = JSON.parse(fs.readFileSync(`messages/o.${ctx.session.lang || 'ru'}.json`))

    ctx.session.opros = []

    let q = 'q1'
    ctx.reply(opros_message.opros.questions[q],
    keyboard([ i18n.getContext('menu-cancel') ]).oneTime().resize().extra())

    return ctx.wizard.next()

}, ctx => {

    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    let opros_message = JSON.parse(fs.readFileSync(`messages/o.${ctx.session.lang || 'ru'}.json`))

    if(ctx.message.text === i18n.getContext('menu-cancel')){
        ctx.reply(i18n.getContext('manu-cancel-text'),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())

        return ctx.scene.leave()
    }
    
    ctx.session.opros.push(ctx.message.text)
    
    let q = 'q2'
    ctx.reply(opros_message.opros.questions[q],
    keyboard([ i18n.getContext('menu-cancel') ]).oneTime().resize().extra())

    return ctx.wizard.next()

}, ctx => {
    
    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    let opros_message = JSON.parse(fs.readFileSync(`messages/o.${ctx.session.lang || 'ru'}.json`))
    
    if(ctx.message.text === i18n.getContext('menu-cancel')){
        ctx.reply(i18n.getContext('manu-cancel-text'),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())

        return ctx.scene.leave()
    }
    
    ctx.session.opros.push(ctx.message.text)
    
    let q = 'q3'
    ctx.reply(opros_message.opros.questions[q],
    keyboard([ i18n.getContext('menu-cancel') ]).oneTime().resize().extra())

    return ctx.wizard.next()

}, ctx => {

    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    let opros_message = JSON.parse(fs.readFileSync(`messages/o.${ctx.session.lang || 'ru'}.json`))
    
    if(ctx.message.text === i18n.getContext('menu-cancel')){
        ctx.reply(i18n.getContext('manu-cancel-text'),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())

        return ctx.scene.leave()
    }
    
    ctx.session.opros.push(ctx.message.text)
    
    let q = 'q4'
    ctx.reply(opros_message.opros.questions[q],
    keyboard([ i18n.getContext('menu-cancel') ]).oneTime().resize().extra())

    return ctx.wizard.next()

}, async ctx => {

    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    let opros_message = JSON.parse(fs.readFileSync(`messages/o.${ctx.session.lang || 'ru'}.json`))
    
    if(ctx.message.text === i18n.getContext('menu-cancel')){
        ctx.reply(i18n.getContext('manu-cancel-text'),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())

        return ctx.scene.leave()
    }

    let user = await User.findById(ctx.from.id)
    
    user.opros.push({
        q1: ctx.session.opros[0],
        q2: ctx.session.opros[1],
        q3: ctx.session.opros[2],
        q4: ctx.message.text
    })
    user.save()
    
    let q = 'done'
    ctx.reply(opros_message.opros[q],
    keyboard(i18n.getContext('menu')).oneTime().resize().extra())

    return ctx.scene.leave()

})

module.exports = wizardScene