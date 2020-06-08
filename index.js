let express = require('express')
let fs = require("fs")
let accountsRouter = require("./routes/accounts.js")
let app = express()
global.fileName = "accounts.json"
const port = 3010

app.use(express.json())
app.use("/account", accountsRouter)

app.listen(port, function () {
  try {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        const init = { "nextId": 1, "accounts": [] }
        fs.writeFile(fileName, JSON.stringify(init), err => {
          res.status(400).send({ error: err.message })
        })
      }
    })

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
  console.log("API Started!")
})