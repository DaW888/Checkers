/* eslint-disable no-undef */
console.log('wczytano plik Net.js');

class Net {
    constructor() {
        console.log('konstruktor klasy Net');
    }

    // wyslanie nazwy uzytkownika na serwer
    // odbior: canLogin, message, if(canLogin){to też users[]}
    sendUserData(userData) {
        $.ajax({
            url: '../server.js',
            data: { action: 'addUser', user: userData },
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                ui.userResponose(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    // wyczysczenie tablicy uzytkownikow
    clearUsersArray(){ // button - resetuj
        $.ajax({
            url: '../server.js',
            data: { action: 'clearArray'},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    usersArray(){
        $.ajax({
            url: '../server.js',
            data: { action: 'getUsersArray'},
            type: 'POST',
            success: function(data) {
                const obj = JSON.parse(data);
                console.log(obj);
                ui.afterSecondUserLogin(obj);
                return obj;
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }

    updateCheckersArray(position){
        $.ajax({
            url: '../server.js',
            data: { action: 'updateCheckersArray', setting: JSON.stringify(position)},
            type: 'POST',
            success: function(data) {
                // const obj = JSON.parse(data);
                // console.log(obj);
                // ui.afterSecondUserLogin(obj);
                // funkcja generująca pionki / ewentualnie jednego
                // return obj;
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
            },
        });
    }
}
