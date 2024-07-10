import pg from "pg"

const { Client } = pg

const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PGPORT,
  host: "localhost",
  database: process.env.POSTGRES_DB,
})

async function insertFileInDB(name, data) {
  await client.query("INSERT INTO files(name,content) VALUES ($1,$2);", [name, data])
}

async function deleteFromDBByName(name) {
  const result = await fileInDB(name)
  if (result.rowCount != 0) {
    await client.query("DELETE FROM files WHERE name = $1", [name])
    return true
  }

  return false
}

async function fileInDB(name) {
  return await client.query("SELECT * FROM files WHERE name = $1", [name])
}

async function getFileFromDB(name) {
  const result = await fileInDB(name)

  if (result.rowCount == 0) return false;

  return result
}

export {
  client,
  insertFileInDB,
  deleteFromDBByName,
  fileInDB,
  getFileFromDB,
}
