const fileUpload = require('express-fileupload');
const express = require('express');
const serveIndex = require('serve-index');
const methods = require('./methods');
const app = express();
const root_dir = process.env.ROOT_DIR;
// #####
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/PowerLearn/" }));
app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res, next) => {
  console.log(req.body);
  const verb = req.body.verb;
  if (methods[verb]) {
    methods[verb](req, res);
  }
  else {
    res.status(400)
      .send(`Неправильно сформований запит.\nДоступні методи ${JSON.stringify(Object.keys(methods))}`);
  }
});

app.use('/', express.static(`${root_dir}/tests`), serveIndex(`${root_dir}/tests`, {
  'icons': true,
  'view': 'details'
}));
console.log(`environement = ${process.env.NODE_ENV}`);
console.log(`root_dir = ${process.env.ROOT_DIR}`);
app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
}); 
