console.log("wczytano plik Net.js");

class Net {
    constructor() {
        console.log("konstruktor klasy Net");
    }

    sendUserData(userData) {
        $.ajax({
            url: "../server.js",
            data: { action: "addUser", user: userData },
            type: "POST",
            success: function(data) {
                var obj = JSON.parse(data);
                console.log(obj);
            },
            error: function(xhr, status, error) {
                console.log(xhr);
            }
        }).then(res => {
            // ui.createDom(JSON.parse(res));
            console.error("WYRZUĆ THENA I ZROB W SUCCESS");
        });
    }
}
