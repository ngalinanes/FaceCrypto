const {
    createLogger,
    format,
    transports
} = require('winston')
const {
    createResponseFormat
} = require('../../helpers/responseFormat')

export const logger = createLogger({
    transports: [
        new transports.File({
            level: 'info',
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../../../logs/info.log`
        }),
        new transports.File({
            level: 'error',
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../../../logs/error.log`
        }),
        new transports.File({
            level: 'warn',
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../../../logs/warn.log`
        }),
        new transports.Console({
            level: 'debug',
            format: format.combine(format.simple())
        })
    ]
})

function getDateForLog() {
    const f = new Date();
    const fecha = f.getFullYear() + '/' + f.getMonth() + '/' + f.getDate() + ' ' + f.getHours() + ':' + f.getMinutes() +
        ':' + f.getSeconds();
    return fecha
}

export const logRequest = function (req: any) : any{

    let header: any = {
        date: getDateForLog(),
        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer,
        userAgent: req.headers["user-agent"]
    }
    logger.info(
        `{ 'Date': '${header.date}', 'Message': { 'tipo': 'REQUEST', 'Host': '${header.host}', 'Origin': '${header.origin}', 'Endpoint': '${header.referer}', 'UserAgent': '${header.userAgent}' } }`
    )

    let response: any = createResponseFormat()

    return response

}

export const logError = function (req: any, error: any) : any{

    let header: any = {
        date: getDateForLog(),
        referer: req.headers ? req.headers.referer : req
    }
    const err: any = typeof error == 'object' ? JSON.stringify(error) : error
    logger.error(`{ 'Date': '${header.date}', 'Message': { 'tipo': 'ERROR', 'Endpoint': '${header.referer}', 'message': '${err}'} }`)

}

module.exports.logWarn = function (req: any, warning: any) {

    let header: any = {
        date: getDateForLog(),
        referer: req.headers ? req.headers.referer : req
    }
    const warn: any = typeof warning == 'object' ? JSON.stringify(warning, null, 2) : warning

    logger.warn(`{ 'Date': '${header.date}', 'Message': { 'tipo': 'ERROR', 'Endpoint': '${header.referer}', 'message': '${warn}'} }`)

}