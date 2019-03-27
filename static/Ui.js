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
        $('#btLoguj').click(()=>{
            var inpNick = $('#inpLogin').val();

            // gdy nick jest pusty
            if(inpNick == ''){
                console.log($('p')[0]);
                $('p')[0].innerHTML = 'Podaj jakiś NICK !!!';
            }else{
                this.myNick = inpNick;
                net.sendUserData(inpNick);
            }
        });
        // przycisk resetujacy tablice userow na serwerze
        $('#btReset').click(()=>{
            net.clearUsersArray();
        });

    }

    // odebranie danych z servera
    // message, canLogin, if(canLogin){users}
    userResponose(data){
        this.resedData = data;
        if(!data.canLogin){
            $('p')[0].innerHTML = data.message + '!!!';
        } else{
            $('p')[0].innerHTML = data.message;
            $('#inpLogin').css({display: 'none'});
            $('#btLoguj').html('Oczekiwanie na drugiego gracza...');
            $('#btLoguj').off('click');
            $('#btReset').off('click');
            this.idInter = setInterval(()=>{
                net.usersArray()
            },1000)
        }
    }
    afterSecondUserLogin(users){ // moze przerobic na funkcje asynchronizna i wrzucic do
        //userResponose
        console.log(users);
        var czekaj = true;
        if(users.length == 2){
            czekaj = false
            clearInterval(this.idInter);
        }
        console.log(users)
        if(!czekaj){
            console.log('jest juz drugi');
            $('#welcomeScreen').css({display: 'none'});
            $('<div>', {html: 'Zalogowano jako '+this.myNick}).addClass('status').appendTo($('body')[0]);

            // jesli loguje sie drugi user to zmienia perspektywe
            var ktoryUser = this.resedData.users.indexOf(this.myNick);
            var pionki = game.checkersGen();
            game.scene.add(pionki);


            if(ktoryUser == 1){
                game.changeSide();
                $('.status').css({backgroundColor: 'rgba(214, 34, 34, 0.324)'});
            }

        }

    }
}
