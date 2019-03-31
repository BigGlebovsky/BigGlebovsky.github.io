"use strict";
var startElm = document.getElementById('start-game');
var startPage = document.getElementById('start-page');
var enterPage = document.getElementById('enter-page');
var enterBut = document.getElementById('enterName');
var userName = document.getElementById('userName');
var cancelName = document.getElementById('cancelName');
var canGame = document.getElementById('canvas');
var recordsTable = document.getElementById('records');
var recordsCon = document.getElementById('recordsTable');
var recordsBut = document.getElementById('record-page');
var closeTable = document.getElementById('closeTable');
var endPage = document.getElementById('end-page');
var music = document.getElementById('music');
var saveBut = document.getElementById('save-game');
var menuBut = document.getElementById('menu-game');
var nickName = null;

startElm.addEventListener("click", switchToEnterPage);
enterBut.addEventListener("click", switchToGamePage);
cancelName.addEventListener("click", switchToMainPage);
recordsBut.addEventListener("click", switchToTablePage);
closeTable.addEventListener("click", switchToMainPage);
saveBut.addEventListener("click", saveGame);
menuBut.addEventListener("click", switchToMainPage);

// в закладке УРЛа будем хранить разделённые подчёркиваниями слова
// #Main - главная
// #Photo_55 - отобразить фото 55
// #About - о нас

// отслеживаем изменение закладки в УРЛе
// оно происходит при любом виде навигации
// в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД
window.onhashchange = switchToStateFromURLHash;

var SPAState = {};

function switchToStateFromURLHash() {
  var URLHash = window.location.hash;

  // убираем из закладки УРЛа решётку
  // (по-хорошему надо ещё убирать восклицательный знак, если есть)
  var stateStr = URLHash.substr(1);

  if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
    var parts = stateStr.split("_")
    SPAState = {
      pagename: parts[0]
    }; // первая часть закладки - номер страницы      
  } else {
    SPAState = {
      pagename: 'Main'
    };
    location.hash = SPAState.pagename;
  }
  // иначе показываем главную страницу

  console.log('Новое состояние приложения:');
  console.log(SPAState);

  // обновляем вариабельную часть страницы под текущее состояние
  // это реализация View из MVC - отображение состояния модели в HTML-код
  switch (SPAState.pagename) {
    case 'Main':
      startPage.style.display = 'flex';
      endPage.style.display = 'none';
      enterPage.style.display = 'none';
      recordsCon.style.display = 'none';
      canGame.style.display = 'none';
      break;
    case 'Enter':
      endPage.style.display = 'none';
      startPage.style.display = 'none';
      enterPage.style.display = 'flex';
      recordsCon.style.display = 'none';
      canGame.style.display = 'none';
      break;
    case 'Game':
      if (userName.value === '') {
        switchToEnterPage();
        userName.style.borderColor = 'red';
        break;
      }
      music.play();
      userName.style.borderColor = '';
      model = new modelGame();
      view = new viewGame();
      controller = new controllerGame();

      model.start(view);
      view.start(model, canvas);
      controller.start(model, canvas);

      enterPage.style.display = 'none'
      endPage.style.display = 'none';
      startPage.style.display = 'none';
      recordsCon.style.display = 'none';
      model.playerName = userName.value;
      view.render();
      view.beginGame();
      canGame.style.display = 'block';
      break;
    case 'End':
      endPage.style.display = 'flex';
      startPage.style.display = 'none';
      enterPage.style.display = 'none';
      recordsCon.style.display = 'none';
      canGame.style.display = 'none';
      break;
    case 'Table':
      startPage.style.display = 'none';
      enterPage.style.display = 'none';
      recordsCon.style.display = 'flex';
      canGame.style.display = 'none';
      endPage.style.display = 'none';
      setTimeout(recTable, 100);
      break;
  }
}

// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function switchToState(newState) {
  // устанавливаем закладку УРЛа
  // нужно для правильной работы кнопок навигации браузера
  // (т.к. записывается новый элемент истории просмотренных страниц)
  // и для возможности передачи УРЛа другим лицам
  var stateStr = newState.pagename;

  location.hash = stateStr;

  // АВТОМАТИЧЕСКИ вызовется switchToStateFromURLHash()
  // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
}

function switchToMainPage() {
  setTimeout(function(){
    model = null;
  view = null;
  controller = null;
  }, 1000)
  
  switchToState({
    pagename: 'Main'
  });
}

function switchToEnterPage() {
  switchToState({
    pagename: 'Enter'
  });
}

function switchToGamePage() {
  switchToState({
    pagename: 'Game'
  });
}

function switchToEndPage() {
  switchToState({
    pagename: 'End'
  });
}

function switchToTablePage() {
  switchToState({
    pagename: 'Table'
  });
}

function saveGame() {
  storeInfo();
  switchToMainPage();
}

function recTable() {

  sortAddRecords();

}
// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
switchToStateFromURLHash();

window.onbeforeunload = befUnload;

function befUnload(EO) {
  EO = EO || window.event;
  EO.returnValue = 'Вы точно хотите закончить игру?';
};