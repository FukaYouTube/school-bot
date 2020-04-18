require('dotenv').config()

const Telegraf = require('telegraf')
const app = new Telegraf(process.env.BOT_TOKEN)

require('mongoose').connect(process.env.URI_MONGO, { useUnifiedTopology: true, useNewUrlParser: true }).catch(e => console.log(e))

const yamlParser = require('yaml-parser')
const i18n = new yamlParser.YamlParser()

const User = require('./model/user.model')

const { Markup, Extra, session } = Telegraf
const { keyboard } = Markup

const stage = require('./stage')

app.use(session())
app.use((ctx, next) => {
    i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)
    next()
})

app.use(stage)

const settings = require('./service/settings')

app.start(async ctx => {
    let user = await User.findById(ctx.from.id)

    if(!user){
        user = new User({
            _id: ctx.from.id,
            username: ctx.from.username,
            first_name: ctx.from.first_name
        })
        user.save()

        ctx.replyWithMarkdown(i18n.getContext('hello', { user: ctx.from }),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())
    }else{
        ctx.replyWithMarkdown(i18n.getContext('hello', { user: ctx.from }),
        keyboard(i18n.getContext('menu')).oneTime().resize().extra())
    }
})

app.hears(/./gm, (ctx, next) => {
    switch(ctx.message.text){
        case i18n.getContext('menu')[0][0]:
            ctx.reply(i18n.getContext('whoami', { user: ctx.from }),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break
        case i18n.getContext('menu')[0][1]:
            ctx.reply(i18n.getContext('about'),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break
        case i18n.getContext('menu')[1][0]:
            ctx.scene.enter('opros')
        break
        case i18n.getContext('menu')[1][1]:
            let extra = Extra.webPreview(false).markup(keyboard(i18n.getContext('menu')).oneTime().resize())
            ctx.replyWithMarkdown(i18n.getContext('FAQ'), extra)
        break
        case i18n.getContext('menu')[2][0]:
            settings.main(i18n, ctx)
        break
        
        // -- 00 --
        case i18n.getContext('settings-menu')[0][0]:
            settings.lang(i18n, ctx)
        break
        case i18n.getContext('edit-lang-menu')[0][0]:
            ctx.session.lang = 'ru'
            i18n.setPath(`messages/${ctx.session.lang || 'ru'}.yml`)

            ctx.reply(i18n.getContext('edit-lang-done'),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break
        case i18n.getContext('edit-lang-menu')[1][0]:
            ctx.session.lang = 'kz'
            i18n.setPath(`messages/${ctx.session.lang || 'kz'}.yml`)

            ctx.reply(i18n.getContext('edit-lang-done'),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break
        case i18n.getContext('edit-lang-menu')[2][0]:
            ctx.session.lang = 'en'
            i18n.setPath(`messages/${ctx.session.lang || 'en'}.yml`)

            ctx.reply(i18n.getContext('edit-lang-done'),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break

        case i18n.getContext('settings-menu')[1][0]:
            ctx.replyWithMarkdown(i18n.getContext('hello', { user: ctx.from }),
            keyboard(i18n.getContext('menu')).oneTime().resize().extra())
        break
        default: next()
    }
})

app.startPolling()