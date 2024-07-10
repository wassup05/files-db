import express from "express"
import router from "./router.js"
import {client} from "./controllers/db_controller.js"

const PORT = process.env.PORT || 8000

const app = express()

app.use("/files", router)

client.connect().then(() => {
  console.log("Connected to DATABASE succesfully!")
  app.listen(PORT, "localhost", () => {
    console.log("SERVER is listening on PORT: ", PORT)
  })
}).catch(e => {
  console.log("could not connect to DATABASE\n", e)
  process.exit(1)
})
