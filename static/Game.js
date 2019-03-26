/* eslint-disable no-undef */
console.log('wczytano plik Game.js');
class Game {
    constructor() {
        console.log('konstruktor klasy Game');
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
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
        // var pionki = this.checkersGen();
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
                side: THREE.DoubleSide,
            }),
            dark: new THREE.MeshBasicMaterial({
                // ciemne derwno
                map: new THREE.TextureLoader().load('../img/darkWood.png'),
                side: THREE.DoubleSide,
            }),
        };
        var cube = null;
        var geometry = new THREE.BoxGeometry(this.sizeOfBlock, 20, this.sizeOfBlock);
        this.chessboardTab.forEach((el1, i) => {
            el1.forEach((el2, j) => {
                console.log(el2);
                if (el2 == 0) cube = new THREE.Mesh(geometry, materials.light);
                else cube = new THREE.Mesh(geometry, materials.dark);

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
        var container = new THREE.Object3D();

        var redChecker = new THREE.MeshBasicMaterial({ color: 0x9f003d });
        var blueChecker = new THREE.MeshBasicMaterial({ color: 0x9ef5ff });
        var geometry = new THREE.CylinderGeometry(30, 30, 10, 32);

        var cylinder = null;
        this.checkersTab.forEach((el1, i) => {
            el1.forEach((el2, j) => {
                console.log(el2, i, j);
                if (el2 == 2) cylinder = new THREE.Mesh(geometry, redChecker);
                else if (el2 == 1) cylinder = new THREE.Mesh(geometry, blueChecker);
                if (el2 > 0) {
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
    }
}
