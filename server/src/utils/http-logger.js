/**
 * https://codesource.io/creating-a-logging-middleware-in-expressjs/
 */
const chalk = require('chalk');
const fs = require('fs');

function getActualRequestDurationInMilliseconds(start) {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

function httpLogger() {
    return (req, res, next) => {
        const current_datetime = new Date();
        const formatted_date = `${current_datetime.getDate()}-${current_datetime.getMonth() + 1}-${current_datetime.getFullYear()} ${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`;
        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        const start = process.hrtime();
        const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
        const log = `[${chalk.blue(formatted_date)}] ${method}:${url} ${status} ${chalk.red(durationInMilliseconds.toLocaleString() + "ms")}`;
        console.log(log);
        fs.appendFile("request_logs.txt", log + "\n", err => {
            if (err) {
                console.log(err);
            }
        });
        next();
    }
}

module.exports = httpLogger;