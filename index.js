let express = require('express')
let fs = require("fs").promises
let accountsRouter = require("./routes/accounts.js")
let app = express()
global.fileName = "accounts.json"
const port = 3010

app.use(express.json())
app.use("/account", accountsRouter)

app.listen(port, async () => {
  try {

    await fs.readFile(fileName, "utf8")
    console.log("API Started!")

  } catch (err) {
    const init = { "nextId": 1, "accounts": [] }
    fs.writeFile(fileName, JSON.stringify(init)).catch(err => {
      res.status(400).send({ error: err.message })
    })
  }
})