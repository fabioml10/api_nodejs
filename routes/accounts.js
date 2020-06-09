let express = require('express')
let fs = require("fs").promises
let router = express.Router()

router.post('/', async (req, res) => {
  let account = req.body

  try {
    let data = await fs.readFile(fileName, "utf8")
    let json = JSON.parse(data)
    account = { id: json.nextId++, ...account }
    json.accounts.push(account)

    await fs.writeFile(fileName, JSON.stringify(json))
    res.send(json)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }

})

router.post("/transaction", async (req, res) => {

  try {
    let params = req.body
    let data = await fs.readFile(fileName, "utf8")

    let json = JSON.parse(data)
    const index = json.accounts.findIndex(account => account.id === params.id)

    if ((params.value < 0) && ((json.accounts[index].balance + params.value) < 0)) {
      throw new Error("Não há saldo suficiente.")
    }

    json.accounts[index].balance += params.value

    await fs.writeFile(fileName, JSON.stringify(json))
    res.send(json.accounts[index])

  } catch {
    res.status(400).send({ error: err.message })
  }

})

router.get('/', async (req, res) => {

  try {
    let data = await fs.readFile(fileName, "utf8")
    let new_data = JSON.parse(data)
    delete new_data.nextId
    res.send(new_data)
  } catch (err) {
    res.status(400).send({ error: err.message })
  }

})

router.get("/:id", async (req, res) => {

  try {
    let data = await fs.readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.accounts.find(account => account.id === parseInt(req.params.id))
    res.send(result)
  } catch (err) {
    res.status(400).send({ error: err.message })
  }

})

router.delete("/:id", async (req, res) => {

  try {
    let data = await fs.readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.accounts.filter(account => account.id !== parseInt(req.params.id))
    json.accounts = result

    await fs.writeFile(fileName, JSON.stringify(json))

    res.send(result)

  } catch {
    res.status(400).send({ error: err.message })
  }

})

router.put("/", async (req, res) => {
  try {
    let newAccount = req.body
    let data = await fs.readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id)

    json.accounts[oldIndex] = newAccount

    await fs.writeFile(fileName, JSON.stringify(json))
    res.send(json)

  } catch {
    res.status(400).send({ error: err.message })
  }
})

module.exports = router