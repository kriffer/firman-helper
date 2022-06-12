const Koa = require("koa");
const cors = require("@koa/cors");
const app = new Koa();
app.use(cors());
const fs = require("fs");
const fsPromises = require('fs').promises;
const mime = require("mime-types");
const Router = require("koa-router");
const koaBody = require("koa-body")({ multipart: true, uploadDir: "." });
const xlsx = require("node-xlsx").default;
const router = new Router();

router.post("/upload", koaBody, async (ctx ) => {
  try {
    console.log(ctx.request.files.report);

    const { filepath, originalFilename, mimetype } = ctx.request.files.report;
    // const fileExtension = mime.extension(mimetype);
    console.log(`path: ${filepath}`);
    console.log(`filename: ${originalFilename}`);
    console.log(`type: ${mimetype}`);
 
   
      
   const out= await fsPromises.copyFile(filepath, `public/reports/${originalFilename}`).then(()=> {
      
   const workSheetsFromFile = xlsx.parse(
        `public/reports/${originalFilename}`
      );
    

     let output = workSheetsFromFile[0].data.slice(1).map((cell) => {
      console.log(cell);
        const record = {};
        record.transactionId = cell[0];
        record.orderNumber = cell[1];
        record.description = cell[2];
        record.totalCapturedAmount = cell[9];
        record.issuer = cell[12];
        record.issuerCountry = cell[13];
        record.timestamp = cell[14];
        record.customer = cell[17];
        return record;
      });
      
      
     
        return output
      
   
   } ).catch((err)=>{
     console.error(err)
   })
    
   
 ctx.body=out;
     
  } catch (err) {
    console.log(`error ${err.message}`);
    await ctx.body("error", { message: err.message });
  }
});
//-------------------------------------------------------------

app.use(router.routes());

// Start the server
const server = app.listen("3002", (error) => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`Server listening on port ${server.address().port}`);
});
