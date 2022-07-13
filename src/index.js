const Express = require("express")
const RequestHandler = require("./lib/handlers/request handlers");
const CorsMiddleware = require("cors");  

const { initializeDB } = require("./lib/db/index");

const Api = Express();

//Express.json => return (request, response, next)=>{}
Api.use(Express.json());
//Express.url => return (request, response, next)=>{}
Api.use(Express.urlencoded({ extended: false }));
//For security reasons we need to add cors middleware
Api.use(CorsMiddleware());
//localhost:3000/api/v1/to-dos
Api.use("/api/v1", RequestHandler)


Api.listen(3000, () => {
  console.log("API is running!")

  initializeDB().then(() => {
    console.log("DATABASE READY");
  });
});




