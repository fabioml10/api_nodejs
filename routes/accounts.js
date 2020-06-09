import express from 'express'
import { promises } from 'fs'

const readFile = promises.readFile
const writeFile = promises.writeFile

const router = express.Router()

router.post('/', async (req, res) => {
  let account = req.body

  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    account = { id: json.nextId++, ...account }
    json.accounts.push(account)

    await writeFile(fileName, JSON.stringify(json))
    logger.info(`POST /account - ${JSON.stringify(account)}`)
    res.send(json)

  } catch (err) {
    logger.error(`POST /account - ${err.message}`)
    res.status(400).send({ error: err.message })
  }

})

router.post("/transaction", async (req, res) => {

  try {
    let params = req.body
    let data = await readFile(fileName, "utf8")

    let json = JSON.parse(data)
    const index = json.accounts.findIndex(account => account.id === params.id)

    if ((params.value < 0) && ((json.accounts[index].balance + params.value) < 0)) {
      throw new Error("Não há saldo suficiente.")
    }

    json.accounts[index].balance += params.value

    await writeFile(fileName, JSON.stringify(json))
    logger.info(`POST /account/transaction - ${JSON.stringify(params.id)}`)
    res.send(json.accounts[index])

  } catch {
    logger.error(`POST /account/transaction - ${err.message}`)
    res.status(400).send({ error: err.message })
  }

})

router.get('/', async (req, res) => {

  try {
    let data = await readFile(fileName, "utf8")
    let new_data = JSON.parse(data)
    delete new_data.nextId
    logger.info(`GET /account - ${JSON.stringify(data)}`)
    res.send(new_data)
  } catch (err) {
    logger.error(`GET /account - ${err.message}`)
    res.status(400).send({ error: err.message })
  }

})

router.get("/:id", async (req, res) => {

  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.accounts.find(account => account.id === parseInt(req.params.id))
    logger.info(`GET /account/:id - ${Jreq.params.id}`)

    res.send(result)
  } catch (err) {
    logger.error(`GET /account/:id - ${err.message}`)
    res.status(400).send({ error: err.message })
  }

})

router.delete("/:id", async (req, res) => {

  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.accounts.filter(account => account.id !== parseInt(req.params.id))
    json.accounts = result

    await writeFile(fileName, JSON.stringify(json))

    logger.info(`DELETE /account - ${req.params.id}`)

    res.send(result)

  } catch {
    logger.error(`DELETE /account - ${err.message}`)
    res.status(400).send({ error: err.message })
  }

})

router.put("/", async (req, res) => {
  try {
    let newAccount = req.body
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const oldIndex = json.accounts.findIndex(account => account.id === newAccount.id)

    json.accounts[oldIndex] = newAccount

    await writeFile(fileName, JSON.stringify(json))

    logger.info(`PUT /account - ${newAccount.id}`)

    res.send(json)

  } catch {
    logger.error(`PUT /account - ${err.message}`)
    res.status(400).send({ error: err.message })
  }
})

export default router