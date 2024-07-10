import express from "express";
import busboy from "busboy";
import { insertFileInDB, deleteFromDBByName, getFileFromDB } from "./controllers/db_controller.js";

const router = express.Router()

router.post("/upload", (req, res) => {
  const bb = busboy({ headers: req.headers, limits: { files: 1, fields: 0 } })
  req.pipe(bb)

  bb.on('file', (_, stream, info) => {
    const filename = info.filename
    let data = ''
    stream.on('data', (c) => {
      data += c
    })

    stream.on('end', async () => {
      await insertFileInDB(filename, data)
      res.status(201).json({
        "message": `succesfully uploaded ${filename}`
      })
    })
  })

  bb.on('fieldsLimit', () => {
    res.status(400).json({
      "error": "can only store binary files"
    })
  })

  bb.on('filesLimit',() => {
    res.status(400).json({
      "error": "can only store a single file"
    })
  })
})

router.get("/retrieve/:file", async (req, res) => {
  const filename = req.params["file"]

  const result = await getFileFromDB(filename)

  if (!result) {
    res.status(404).json({
      "error": "no such file exists"
    })
  } else {
    res.json({
      "content-type": "application/octet-stream",
      "filename": filename,
      "content": result.rows[0].content.toString()
    })
  }
})

router.delete("/delete/:file", async (req, res) => {
  const filename = req.params["file"]
  const result = await deleteFromDBByName(filename)

  if (!result) {
    res.status(404).json({
      "error": `no such file ${filename}`
    })
  } else {
    res.json({
      "message": `succesfully deleted file ${filename}`
    })
  }
})

export default router
