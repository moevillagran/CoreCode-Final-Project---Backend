const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

async function getDBHandler() {
  try {
    const dbHandler = await open({
      filename: "database.sqlite",
      driver: sqlite3.Database,
    });

    if (!dbHandler)
      throw new TypeError(`DB Handler expected, got: ${dbHandler}`);

    return dbHandler; //*Modificador de datos
  } catch (error) {
    console.error(
      "There was an error trying to get the DB Handler: ",
      error.message
    );
  }
}

async function initializeDB() {
  try {
    const dbHandler = await getDBHandler(); //*Funcion asincrona
    //*No tiene manejador de datos booleano por eso usamos valores enteros de 0(false) y 1(verdadero)
    await dbHandler.exec(
      `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          title TEXT,
          description TEXT,
          is_done INTEGER DEFAULT 0,
          creation_date TEXT,
          edit_date TEXT
        )
    `);

    await dbHandler.close();
  } catch (error) {
    console.error(
      "There was an error trying to initialize the DB: ",
      error.message
    );
  }
}

module.exports = { getDBHandler, initializeDB };
