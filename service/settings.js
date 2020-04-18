const { keyboard } = require('telegraf/markup')

module.exports = {
    main: (i18n, ctx) => {
        ctx.reply(i18n.getContext('settings'),
        keyboard(i18n.getContext('settings-menu')).oneTime().resize().extra())
    },
    lang: (i18n, ctx) => {
        ctx.reply(i18n.getContext('edit-lang-text'),
        keyboard(i18n.getContext('edit-lang-menu')).oneTime().resize().extra())
    }
}