/* eslint-disable no-undef */
console.log('wczytano plik Ui.js');

class Ui {
    constructor() {
        console.log('konstruktor klasy Ui');
        this.welcomeScreen();
        this.myNick = null;
    }

    welcomeScreen() {
        $('#inpLogin').select();
        $('#btLoguj').click(() => {
            var inpNick = $('#inpLogin').val();

            // gdy nick jest pusty
            if (inpNick == '') {
                console.log($('p')[0]);
                $('p')[0].innerHTML = 'Podaj NICK !!!';
            } else {
                this.myNick = inpNick;
                net.sendUserData(inpNick);
            }
        });
        // przycisk resetujacy tablice userow na serwerze
        $('#btReset').click(() => {
            net.clearUsersArray();
        });
    }

    // odebranie danych z servera
    // message, canLogin, if(canLogin){users}
    userResponose(data) {
        this.resedData = data;
        if (!data.canLogin) {
            $('p')[0].innerHTML = data.message + '!!!';
        } else {
            $('p')[0].innerHTML = data.message;
            $('#inpLogin').css({ display: 'none' });
            $('#btLoguj').html('Oczekiwanie na drugiego gracza...');
            $('#btLoguj').off('click');
            $('#btReset').off('click');
            this.idInter = setInterval(() => { //!komentujemy
                net.usersArray();
            }, 500); //!komentujemy
        }
    }
    afterSecondUserLogin(users) {
        // moze przerobic na funkcje asynchronizna i wrzucic do
        //userResponose
        console.log(users);
        var czekaj = true; //! to powinno być równe TRUE, ale do testów używamy FALSE
        if (users.length == 2) {
            czekaj = false;
            clearInterval(this.idInter);
        }
        console.log(users);
        if (!czekaj) {
            console.log('jest juz drugi');
            $('#welcomeScreen').css({ display: 'none' });
            $('#welcomeScreen').remove();

            var info = $('<div>')
                .addClass('status')
                .appendTo($('body')[0]);

            $('<p>', { html: 'Zalogowano jako ' + this.myNick })
                .addClass('nickInfo') // informacja na tematu nicku zawodnika
                .appendTo($(info));
            
            $('<p>')
                .addClass('gameInfo') // informacje z gry
                .appendTo($(info));

            // jesli loguje sie drugi user to zmienia perspektywe
            var ktoryUser = this.resedData.users.indexOf(this.myNick);
            var pionki = game.checkersGen();
            game.scene.add(pionki);

            if (ktoryUser == 1) {
                game.changeSide();
                $('.status').css({ backgroundColor: 'rgba(214, 34, 34, 0.324)' });
            }
        }
    }
}
