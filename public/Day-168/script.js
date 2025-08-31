class Bingo {
  constructor(list) {
    this.createCard = this.createCard.bind(this);
    this.spin = this.spin.bind(this);
    this.$ = document.querySelector(list);
    this.numbers = [];
    let rows = '';
    for (let i = 0; Bingo.EACH_RANGE * 5 > i; i++) {
      const row = `
        <li><input type="checkbox" value="${i + 1}" disabled></li>
      `;
      this.numbers.push(i + 1);
      rows += row;
    }
    this.numbers.forEach((i, from) => {
      const to = Math.floor(Math.random() * this.numbers.length);
      const temp = this.numbers[to];
      this.numbers[to] = i;
      this.numbers[from] = temp;
    });
    this.$.innerHTML = rows;
  }

  createCard(selector) {
    return new Card(Bingo.EACH_RANGE, selector);
  }
  spin(card) {
    if (!this.numbers.length) return;
    const n = this.numbers.shift();
    const checkbox = this.$.querySelector(`input[value="${n}"]`);
    checkbox.checked = true;
    checkbox.parentNode.classList.add('checked');
    return card.punch(n);
  }}


class Card {
  constructor(eachRange, selector) {
    let rows = '';
    this.numbers = [];
    this.myNumbers = [];
    this.punch = this.punch.bind(this);
    this._checkBingo = this._checkBingo.bind(this);
    this._checkRow = this._checkRow.bind(this);
    this._checkColumn = this._checkColumn.bind(this);
    this._checkCross = this._checkCross.bind(this);
    this._isPunched = this._isPunched.bind(this);

    for (let i = 0; 5 > i; i++) {
      const ary = [];
      for (let j = 0; eachRange > j; j++)
      ary.push(eachRange * i + j + 1);
      ary.forEach((n, from) => {
        const to = Math.floor(Math.random() * ary.length);
        const temp = ary[to];
        ary[to] = n;
        ary[from] = temp;
      });
      this.numbers.push(ary);
    }
    for (let y = 0; 5 > y; y++) {
      let row = '<tr>';
      for (let x = 0; 5 > x; x++) {
        let cell = '';
        const numberObj = {};
        if (Card.CENTER_INDEX === y * 5 + x) {
          cell = this._createCellTemplate(0);
          numberObj.n = 0;
          numberObj.punched = true;
        } else {
          const column = x % 5;
          const n = this.numbers[column].shift();
          cell = this._createCellTemplate(n);
          numberObj.n = n;
          numberObj.punched = false;
        }
        row += cell;
        this.myNumbers.push(numberObj);
      }
      rows += row;
    }
    this.punch = this.punch.bind(this);
    this.$ = document.querySelector(selector);
    this.$.innerHTML = rows;
  }

  _createCellTemplate(n) {
    n = n > 0 ? n : '';
    const attrs = n ? 'disabled' : 'checked disabled';
    return `<td><input type="checkbox" name="number" value="${n}" ${attrs}><div>${n}</div></td>`;
  }
  punch(n) {
    let checkbox;
    let index = -1;
    let checkboxes = this.$.querySelectorAll('input');
    for (let i = 0; checkboxes.length > i; i++) {
      if (parseInt(checkboxes[i].value) === n) {
        checkbox = checkboxes[i];
        index = i;
        break;
      }
    }
    if (index < 0) return Card.PUNCHED_STATE.NOT_FOUND;
    checkbox.checked = true;
    this.myNumbers[index].punched = true;
    if (this._checkBingo(index))
    return Card.PUNCHED_STATE.BINGO;else

    return Card.PUNCHED_STATE.PUNCHED;
  }

  _checkBingo(index) {
    const tests = [
    this._checkCross,
    this._checkRow,
    this._checkColumn];

    return tests.some(test => test(index));
  }
  _checkCross(index) {
    const lt2br = [];
    const rt2bl = [];
    for (let i = 0; 5 > i; i++) {
      lt2br.push(i * 6);
      rt2bl.push((i + 1) * 4);
    }
    // 斜めチェックスキップ
    const lt = lt2br.indexOf(index) >= 0;
    const rt = rt2bl.indexOf(index) >= 0;
    if (!lt && !rt) return false;
    const targetIdxes = lt ? lt2br : rt2bl;
    return targetIdxes.map(i => this.myNumbers[i]).
    every(this._isPunched);
  }
  _isPunched(obj) {
    return obj.punched;
  }
  _checkRow(index) {
    const start = Math.floor(index / 5);
    const startRow = start * 5;
    return this.myNumbers.slice(startRow, startRow + 5).
    every(this._isPunched);
  }
  _checkColumn(index) {
    const start = index % 5;
    const ary = [];
    for (let i = 0; 5 > i; i++)
    ary.push(this.myNumbers[5 * i + start]);
    return ary.every(this._isPunched);
  }}


Bingo.EACH_RANGE = 15;
Card.CENTER_INDEX = 12;
Card.PUNCHED_STATE = {
  PUNCHED: 0,
  BINGO: 1,
  NOT_FONUD: -1 };

class Main {
  constructor() {
    const $ = document.querySelector.bind(document);
    this.initGame = this.initGame.bind(this);
    this.initGame();
    $('#spin').addEventListener('click', () => {
      const res = this.game.spin(this.card);
      if (res === Card.PUNCHED_STATE.BINGO) {
        const list = document.createElement('li');
        list.innerHTML = 'BINGO';
        this.messages.appendChild(list);
      }
    });
    $('#init').addEventListener('click', this.initGame);
  }

  initGame() {
    this.game = new Bingo('#numbers-list');
    this.card = this.game.createCard('#bingo-body');
    this.messages = document.querySelector('#messages');
    this.messages.innerHTML = '';
  }}


new Main();