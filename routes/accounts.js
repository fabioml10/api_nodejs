let express = require('express')
let fs = require("fs")
let router = express.Router()

router.post('/', (req, res) => {
  let account = req.body

  fs.readFile(fileName, "utf8", (err, data) => {

    if (!err) {
      try {
        let json = JSON.parse(data)
        account = { id: json.nextId++, ...account }
        json.accounts.push(account)

        fs.writeFile(fileName, JSON.stringify(json), err => {
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

router.post("/transaction", (req, res) => {
  let params = req.body

  fs.readFile(fileName, "utf8", (err, data) => {
    try {
      if (err) throw err

      let json = JSON.parse(data)
      const index = json.accounts.findIndex(account => account.id === params.id)

      if((params.value < 0) && ((json.accounts[index].balance + params.value) < 0)){
        throw new Error("Não há saldo suficiente.")
      }
      
      json.accounts[index].balance += params.value
      fs.writeFile(fileName, JSON.stringify(json), err => {
        if (err) {
          res.status(400).send({ error: err.message })
        } else {
          res.send(json.accounts[index])
        }
      })

    } catch {
      res.status(400).send({ error: err.message })
    }
  })
})

router.get('/', (req, res) => {

  fs.readFile(fileName, "utf8", (err, data) => {
    if (!err) {
      let new_data = JSON.parse(data)
      delete new_data.nextId
      res.send(new_data)
    } else {
      res.status(400).send({ error: err.message })
    }
  })

  let account = req.body

  fs.readFile(fileName, "utf8", (err, data) => {

    if (!err) {
      try {
        let json = JSON.parse(data)
        account = { id: json.nextId++, ...account }
        json.accounts.push(account)

        fs.writeFile(fileName, JSON.stringify(json), err => {
          if (err) {
            res.status(400).send({ error: err.message })
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

router.get("/:id", (req, res) => {

  try {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (!err) {
        let json = JSON.parse(data)
        const result = json.accounts.find(account => account.id === parseInt(req.params.id))

        if (result) {
          res.send(result)
        } else {
          res.send("nenhum registro encontrado.")
        }

      } else {
        res.status(400).send({ error: err.message })
      }
    })

  } catch (err) {
    res.status(400).send({ error: err.message })
  }

})

router.delete("/:id", (req, res) => {

  fs.readFile(fileName, "utf8", (err, data) => {

    try {

      if (err) throw err

      let json = JSON.parse(data)
      const result = json.accounts.filter(account => account.id !== parseInt(req.params.id))

      if (result) {
        res.send(result)
      } else {
        res.send("nenhum registro encontrado.")
      }

      fs.writeFile(fileName, JSON.stringify(json), err => {
        if (err) {
          res.status(400).send({ error: err.message })
        } else {
          res.end()
        }
      })

    } catch {
      res.status(400).send({ error: err.message })
    }
  })

})

router.put("/", (req, res) => {
  let newAccount = req.body

  fs.readFile(fileName, "utf8", (err, data) => {
    try {
      if (err) throw err

      let json = JSON.parse(data)
      const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id)
      json.accounts[oldIndex] = newAccount

      fs.writeFile(fileName, JSON.stringify(json), err => {
        if (err) {
          res.status(400).send({ error: err.message })
        } else {
          res.end()
        }
      })

    } catch {
      res.status(400).send({ error: err.message })
    }
  })
})

module.exports = router