/* eslint-disable no-undef */
console.log('wczytano plik Game.js');
class Game {
    constructor() {
        console.log('konstruktor klasy Game');
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.scene = new THREE.Scene();

        // uklad szachownicy
        this.chessboardTab = [
            // light - 0, dark - 1;
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        // startowe rozmieszczenie pionkow
        this.checkersTab = [
            [0, 2, 0, 2, 0, 2, 0, 2], // 2 - czerwone
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1], // 1 - białe
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        // wielkosc od ktorej zalezy rozmiar planszy
        this.sizeOfBlock = 70;
        this.userColor = 'blueChecker';

        this.generator3d();
    }

    // funkcja startowa 3d, init
    generator3d() {
        // antialias: wygladzanie krawedzi elementow sceny
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0x000030);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // kolorowe osie x,y,z
        var axes = new THREE.AxesHelper(1000);
        this.scene.add(axes);
        $('#root').append(renderer.domElement);

        // ustawienie kamery oraz punktu w któty patrzy
        this.camera.position.set(600, 320, 0);
        this.camera.lookAt(this.scene.position);

        // dodanie szachownicy do sceny
        var plansza = this.polaGen();
        this.scene.add(plansza);

        // dodanie pionków do sceny
        // var pionki = this.checkersGen(); //? funkcja przeniesiona do UI
        // this.scene.add(pionki);

        var render = () => {
            // cube.rotation.y += 0.01;

            // dopasowanie wielkości rendera do dymanicznie zmienianej szerokości okna przeglądarki
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // rendering
            requestAnimationFrame(render);
            console.log('render leci');
            renderer.render(this.scene, this.camera);
        };
        render();
    }

    // funkcja generująca szachownice
    polaGen() {
        var container = new THREE.Object3D();

        var materials = {
            light: new THREE.MeshBasicMaterial({
                // jasne derwno
                map: new THREE.TextureLoader().load('../img/lightWood.png'),
            }),
            dark: new THREE.MeshBasicMaterial({
                // ciemne derwno
                map: new THREE.TextureLoader().load('../img/darkWood.png'),
            }),
        };
        var cube = null;
        var geometry = new THREE.BoxGeometry(this.sizeOfBlock, 20, this.sizeOfBlock);
        this.chessboardTab.forEach((el1, i) => {
            el1.forEach((el2, j) => {
                console.log(el2);
                if (el2 == 0) {
                    cube = new THREE.Mesh(geometry, materials.light);
                    cube.name = 'light';
                } else {
                    cube = new THREE.Mesh(geometry, materials.dark);
                    cube.name = 'dark';
                }

                cube.position.set(
                    (-4 + j) * this.sizeOfBlock + this.sizeOfBlock / 2,
                    0,
                    (-4 + i) * this.sizeOfBlock + this.sizeOfBlock / 2
                );
                container.add(cube);
            });
        });

        return container;
    }

    // funkcja generująca pionki na szachownicy
    checkersGen() {
        this.raycaster();
        var container = new THREE.Object3D();

        var cylinder = null;
        this.checkersTab.forEach((el1, i) => {
            el1.forEach((el2, j) => {
                console.log(el2, i, j);
                var oneChecker = new Checker();
                if (el2 == 2) oneChecker.checker = 0x9f003d;
                // przeciwnik kolor
                else if (el2 == 1) oneChecker.checker = 0x9ef5ff; // ja kolor
                if (el2 > 0) {
                    cylinder = oneChecker.checker;
                    cylinder.position.set(
                        (-el1.length / 2 + i) * this.sizeOfBlock + this.sizeOfBlock / 2,
                        20,
                        (-el1.length / 2 + j) * this.sizeOfBlock + this.sizeOfBlock / 2
                    );
                    container.add(cylinder);
                }
            });
        });
        return container;
    }

    // funkcja odwracająca stronę dla drugiego gracza
    changeSide() {
        this.camera.position.set(-600, 320, 0);
        this.camera.lookAt(this.scene.position);
        this.userColor = 'redChecker';
    }

    raycaster() {
        var clickElement = 1; // 0 - pole, 1- pionek
        var mouseVector = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();

        var positionOfField = null; // x,y,z - klikanego pola (tylko ciemnego)
        var thisChecker = null; // wybrany pionek
        var beforeCheckerColor = null; // kolor wybranego elementu (by można było do niego wrócić)

        $(document).mousedown(e => {
            console.log(ui.myNick); // moj nick pobrany z ui
            mouseVector.x = (e.clientX / $(window).innerWidth()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).innerHeight()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            // intersects / raycaster nie działa na kontenerach, by je obsłużyć trzeba wejść głębiej
            var intersects = null;

            if (clickElement == 0) {
                intersects = raycaster.intersectObjects(this.scene.children[1].children);
                if (intersects.length > 0) {
                    var currentField = intersects[0].object;
                    if (currentField.name == 'dark') {
                        $('.gameInfo').empty();
                        console.log(currentField.position);
                        positionOfField = currentField.position; // ustalenie pozycji pola
                        thisChecker.position.x = positionOfField.x; // ustawienie pozycji pionka na klikane pole (X, niżej Z)
                        thisChecker.position.z = positionOfField.z;
                        thisChecker.material.color = beforeCheckerColor; // ustawienie domyślnego koloru pionka
                        clickElement = 1; // zmiana kolejki na pionka
                    } else $('.gameInfo').html('Możesz poruszać się tylko po ciemnych polach !');
                    // currentField.material.color = {r: 0, g: 0, b: 1};
                }
            } else if (clickElement == 1) {
                intersects = raycaster.intersectObjects(this.scene.children[2].children);
                if (intersects.length > 0) {
                    var currentChecker = intersects[0].object;

                    if (this.userColor == currentChecker.name) { // sprawdzenie czy kolor pionka zgadza sie z kolorem wybranym przez gracza
                        beforeCheckerColor = currentChecker.material.color; // zapisanie koloru tego pionka
                        thisChecker = currentChecker;
                        currentChecker.material.color = { r: 1, g: 0, b: 0.5 }; // podświetlenie pionka na różowo
                        // currentChecker.position.y += 20; // dodać światło oraz cienie
                        clickElement = 0; // zmiana kolejki na pole
                    } else $('.gameInfo').html('Graj swoimi !');
                }
            }
        });
    }
}
