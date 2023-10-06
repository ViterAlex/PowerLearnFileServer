const fs = require('fs');
const Tests = require('./Model/Tests');
const root_dir = process.env.ROOT_DIR;

const sendFile = (path, res, deleteFile = true) => {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      res
        .status(404)
        .send('Тест не знайдено');
    }
  });
  res
    .status(200)
    .sendFile(path);
  if (deleteFile) {
    fs.rm(path, () => { });
  }
};

const download = (req, res) => {
  //Повернути 403 код з повідомленням
  // res.sendStatus(403);
  console.log(req.body);
  if (!req.body.id) {
    res
      .status(400)
      .send('Неправильний запит');
  }

  if (req.body.fullName === '') {
    res.status(400)
      .send("Не вказане ім'я");
  }
  const tests = new Tests();
  if (tests.contains(req.body.id, req.body.fullName)) {
    res.status(403)
      .send('Тест вже пройдено');
  }
  const path = `${root_dir}/tests/${req.body.id}.xml`;
  sendFile(path, res, false);
};

const donwloadCompleted = (req, res) => {

};

const getList = (req, res) => {
  const xml2js = require('xml-js');
  if (!req.body.id) {
    res
      .status(400)
      .send('Неправильний запит');
    return;
  }
  const tests = new Tests();
  if (!tests.contains(req.body.id)) {
    res
      .status(404)
      .send('Тест не знайдено');
  }
  let xmlobj = xml2js.js2xml({ Tests: { test: tests.getTests(req.body.id) } }, { compact: true, spaces: 4 });
  xmlobj = `<?xml version="1.0" encoding="utf-8"?>\n` + xmlobj;
  const path = `${__dirname}/completed.xml`;
  fs.writeFileSync(path, xmlobj, () => { });
  sendFile(path, res);
};

const saveFile = (file, path) => {
  file.mv(path, (err, result) => {
    if (err) {
      throw new Error(JSON.stringify(err));
    }
    const msg = `File '${file.name}' uploaded and saved as '${fileName}'`;
    console.log(msg);
    return msg;
  });
};

const ifUploaded = (req, res) => {
  console.log(req.body);
  if (fs.existsSync(`${root_dir}/tests/${req.body.id}.xml`)) {
    console.log('Sent OK');
    res.sendStatus(200);
  }
  else {
    console.log("Sent not OK");
    res.sendStatus(400);
  }
}

/** */
const upload = (req, res) => {
  const file = req.files.file;
  let fileName = `${file.name}`;
  if (req.body.id) {
    fileName = `${req.body.id}.xml`;
  }
  else {
    res
      .status(400)
      .send('Неправильний запит');
  }
  const path = `${root_dir}/tests/${fileName}`;
  file.mv(path, (err, result) => {
    if (err) {
      return console.error(err);;
    }
    const msg = `Тест '${file.name}' збережено як '${fileName}'`;
    console.log(msg);
    res
      .status(200)
      .send(msg);
  });
};

/**
 * Завантаження завершенного тесту
 * @param {Request} req 
 * @param {Response} res 
 */
const uploadCompleted = (req, res) => {
  const Tests = require('./Model/Tests');
  console.log(req.body);
  const tests = new Tests();
  const t = tests.add(req.body.id, req.body.name, req.body.max, req.body.score);
  req.files.file.mv(`${root_dir}/tests/completed/${t.fileName}.xml`);
  res
    .status(200)
    .send('Пройдений тест завантажено');
};

/**
 * Видалення пройденого тесту для вказаного користувача
 * @param {Request} req - Запит до сервера. Має містити {@link id} та {@link name}
 * @param {Response} res - Відповідь сервера. Можливі значення:
 *  200, якщо вдалося видалити тест;
 *  400, якщо виникла помилка при видаленні
 */
const deleteCompleted = (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  if (id == undefined || name == undefined) {
    res
      .status(400)
      .send("Не вдалося видалити тест");
    return;
  }
  const tests = new Tests();
  if (tests.remove(id, name)) {
    res
      .status(200)
      .send("Пройдений тест видалено");
    return;
  }
  res
    .status(400)
    .send("Не вдалося видалити тест.");
};

/**
 * 
 * @param {Request} req - Запит до сервера. Має містити {@link id}
 * @param {Response} res - Відповідь сервера. Можливі значення:
 *  200, якщо вдалося видалити тест;
 *  400, якщо виникла помилка при видаленні 
 * @returns 
 */
const deleteTest = (req, res) => {
  const tests = new Tests();
  const filePath = `${root_dir}/tests/${req.body.id}.xml`;
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, ()=>{});
    console.log("Test deleted");
  }
  if (tests.removeTest(req.body.id)) {
    console.log("Comleted tests deleted");
    res
      .status(200)
      .send('Тест видалено.');
    return;
  }
  res
    .status(400)
    .send("Не вдалося видалити тест.");
};

module.exports = { download, donwloadCompleted, getList, upload, uploadCompleted, deleteCompleted, deleteTest, ifUploaded };