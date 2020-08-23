const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const packname = "./package";
// fs.stat(filename, (err, stat) => {
//   const options = {
//     host: "localhost",
//     port: 8081,
//     path: `/?filename=${packname}.zip`,
//     method: "post",
//     headers: {
//       "Content-Type": "application/octet-stream",
//       "Content-Length": stat.size,
//     },
//   };

//   const req = http.request(options, (res) => {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     // res.setEncoding('utf8');
//     // res.on('data', (chunk) => {
//     //   console.log(`BODY: ${chunk}`);
//     // });
//     // res.on('end', () => {
//     //   console.log('No more data in response.');
//     // });
//   });

//   req.on("error", (e) => {
//     console.error(`problem with request: ${e.message}`);
//   });

//   // Write data to request body

//   const readfileStream = fs.createReadStream(
//     path.resolve(__dirname, `./${packname}.zip`)
//   );
//   readfileStream.pipe(req);
//   readfileStream.on("end", () => {
//     req.end();
//   });
// });

const options = {
  host: "localhost",
  port: 8081,
  path: `/?filename=${packname}.zip`,
  method: "post",
  headers: {
    "Content-Type": "application/octet-stream",
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  // res.setEncoding('utf8');
  // res.on('data', (chunk) => {
  //   console.log(`BODY: ${chunk}`);
  // });
  // res.on('end', () => {
  //   console.log('No more data in response.');
  // });
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

const archive = archiver('zip', {
  zlib: {level: 9}
})

archive.directory(packname, false)

archive.pipe(req)

archive.finalize()

archive.on('end', () => {
  req.end()
})