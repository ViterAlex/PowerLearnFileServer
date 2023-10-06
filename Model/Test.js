module.exports = class Test {
  constructor(id, name, max, score) {
    this.id = id;
    this.name = name;
    this.max = max;
    this.score = score;
    this.date = Date.now();
  }
  
  get fileName() {
    return `${this.id}_${this.name.split(' ').join('_')}`
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      max: this.max,
      score: this.score,
      date: this.date,
    });
  };

};