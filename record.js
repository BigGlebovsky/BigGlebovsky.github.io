"use strict";

var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
var updatePassword;
var stringName = 'ZHIDOVICH_TEST_INFO';
var storage = {};

function storeInfo() {
    updatePassword = Math.random();
    $.ajax({
        url: ajaxHandlerScript,
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
            f: 'LOCKGET',
            n: stringName,
            p: updatePassword
        },
        success: lockGetReady,
        error: errorHandler
    });
}

function lockGetReady(callresult) {
    if (callresult.error != undefined) {
        alert(callresult.error);
    }

    if (callresult.result != "") {
        var info = JSON.parse(callresult.result);
        for (let key in info) {
            if (key == model.playerName && info[key].score < model.score) {

                storage[model.playerName] = {
                    score: model.score
                };
                $.ajax({
                    url: ajaxHandlerScript,
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    data: {
                        f: 'UPDATE',
                        n: stringName,
                        v: JSON.stringify(storage),
                        p: updatePassword
                    },
                    success: updateReady,
                    error: errorHandler
                });
            }
        }
    } else { 
        return;
    }
}

function updateReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
}

function restoreInfo() {
    $.ajax({
        url: ajaxHandlerScript,
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: {
            f: 'READ',
            n: stringName
        },
        success: readReady,
        error: errorHandler
    });
}

function readReady(callresult) {
    if (callresult.error != undefined)
        alert(callresult.error);
    else if (callresult.result != "") {
        var info = JSON.parse(callresult.result);
        storage = info;

    }
}

function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
}

restoreInfo();

function sortAddRecords() {
    recordsTable.innerHTML = '<tr><th>Место</th><th>Имя игрока</th><th>Очки</th></tr>';

    var num = 0;
    var array2 = [];

    for (let j = 0; j < 3; j++) {
        var num = 0;
        for (let key in storage) {
            if (num < storage[key].score && array2.indexOf(storage[key].score) == -1) {
                num = storage[key].score;
            }
        }
        array2.push(num);
    }

    for (let i = 0; i < array2.length; i++) {
        for (var key in storage) {
            if (array2[i] == storage[key].score) {
                let a = document.createElement('tr');
                a.innerHTML = '<td>' + (i + 1) + '</td>' + '<td>' + key + '</td>' + '<td>' + storage[key].score + '</td>';
                recordsTable.appendChild(a);
            }
        }
    }

    return;
}