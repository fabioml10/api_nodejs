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

module.exports = router