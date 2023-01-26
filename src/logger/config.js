import log4js from "log4js";

log4js.configure({
    appenders: {
        consola:{ type: "console"},
        fileWarning: {type: "file", filename: "src/logger/logs/warn.log"},
        fileError: {type: "file", filename: "src/logger/logs/error.log"}
    },
    categories: {
        default: {appenders: ['consola'], level: "info"},
        warning: {appenders:['consola','fileWarning'], level: "warn"},
        error: {appenders:['consola','fileError'], level: "error"}
    }
})

const logger = log4js.getLogger()
const warningLogger = log4js.getLogger('warning')
const errorLogger = log4js.getLogger('error')

export { logger, warningLogger, errorLogger }