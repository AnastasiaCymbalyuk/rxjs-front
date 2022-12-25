import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap } from 'rxjs/operators';

function getDate(date) {
  let newDate = new Date(date);
  newDate = newDate.toLocaleString('ru');
  return newDate.substr(0, 17).replace(',', '');
}

function getSub(text) {
  if (text.length > 15) {
    return `${text.slice(0, 15)}...`;
  }
  return text;
}

export default class Widget {
  constructor(el) {
    this.element = el;
    this.msg = document.querySelector('.box_massages');
    this.url = 'http://localhost:7070/messages/unread';
  }

  init() {
    this.getMes();
    this.idMsg = 0;
  }

  getMes() {
    interval(4000).pipe(
      mergeMap(() => ajax.getJSON(`${this.url}?id=${this.idMsg}`)),
    )
      .subscribe((messages) => {
        this.renderMsg(messages);
      });
  }

  renderMsg(mes) {
    mes.forEach((el) => {
      const date = getDate(el.received);
      const sub = getSub(el.subject);
      this.msg.insertAdjacentHTML('afterbegin', `
        <div class="msg">
            <div class="msg_item">${el.from}</div>
            <div class="msg_item">${sub}</div>
            <div class="msg_item">${date}</div>
        </div>
      `);
      this.idMsg = el.id;
    });
  }
}
