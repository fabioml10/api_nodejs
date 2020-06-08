let express = require('express')
let fs = require("fs")
let app = express()
const port = 3010

app.use(express.json())

app.post('/account', (req, res) => {
  let account = req.body

  fs.readFile("accounts.json", "utf8", (err, data) => {

    if (!err) {
      try {
        let json = JSON.parse(data)
        account = { id: json.nextId++, ...account }
        json.accounts.push(account)

        fs.writeFile("accounts.json", JSON.stringify(json), err => {
          if (err) {
            console.log(err)
          } else {
            res.end()
          }
        })

      } catch (err) {
        res.status(400).send({ error: err.message })
      }
    } else {
      res.status(400).send({ error: err.message })
    }

  })

})

app.listen(port, function () {
  try {
    fs.readFile("accounts.json", "utf8", (err, data) => {
      if (err) {
        const init = { "nextId": 1, "accounts": [] }
        fs.writeFile("accounts.json", JSON.stringify(init), err => {
          res.status(400).send({ error: err.message })
        })
      }
    })

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
  console.log("API Started!")
})