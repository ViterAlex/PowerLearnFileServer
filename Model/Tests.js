const fs = require('fs');
const Test = require('./Test');
module.exports = class Tests {
  static dbfile = `${__dirname}/completedTests.db`;

  constructor() {
    if (!fs.existsSync(Tests.dbfile)) {
      const obj = {
        Tests: {}
      };
      fs.writeFileSync(Tests.dbfile, JSON.stringify(obj));
    }
    this.db = JSON.parse(fs.readFileSync(Tests.dbfile));
  }

  add(id, name, max, score) {
    if (this.db['Tests'][id] == undefined) {
      this.db['Tests'][id] = [];
    }
    const result = new Test(id, name, max, score);
    this.db['Tests'][id].push(result);
    fs.writeFileSync(Tests.dbfile, JSON.stringify(this.db));
    return result;
  }

  contains(id, name) {
    if (name == undefined) {
      return this.db['Tests'][id] != undefined;
    }
    const completed = this.db['Tests'][id];
    return completed != undefined && completed.find(el => el.name == name) != undefined;
  }

  remove(id, name) {
    if (!this.contains(id, name)) {
      return false;
    }
    this.db['Tests'][id] = this.db['Tests'][id].filter(t => t.name != name);
    fs.writeFileSync(Tests.dbfile, JSON.stringify(this.db));
    return true;
  }

  removeTest(id) {
    if (!this.contains(id)) {
      return false;
    }
    fs.writeFileSync(Tests.dbfile, JSON.stringify(this.db));
    return true;
  }

  getTests(id) {
    return this.db['Tests'][id];
  }
};