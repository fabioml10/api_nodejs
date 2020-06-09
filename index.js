const express = require('express')
const fs = require("fs").promises
const accountsRouter = require("./routes/accounts.js")
const app = express()
const port = 3010
const winston = require("winston")

global.fileName = "accounts.json"

const {combine, timestamp, label, printf} = winston.format
const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "my-api.log"})
  ],
  format: combine(
    label({label: "my-api"}),
    timestamp(),
    myFormat
  )
})

app.use(express.json())
app.use("/account", accountsRouter)

app.listen(port, async () => {
  try {

    await fs.readFile(fileName, "utf8")
    logger.info("API Started!")

  } catch (err) {
    const init = { "nextId": 1, "accounts": [] }
    fs.writeFile(fileName, JSON.stringify(init)).catch(err => {
      logger.error(err)
      res.status(400).send({ error: err.message })
    })
  }
})