// class Checker { //? bez dziedziczenia z klasy THREE.MESH
//     constructor() {
//         console.log('const');
//         this._checker = new THREE.MeshBasicMaterial({ color: 0xffffff });
//         this.geometry = new THREE.CylinderGeometry(30, 30, 10, 32);
//     }

//     set checker(color) {
//         this._checker.color.setHex(color);
//     }

//     get checker() {
//         return new THREE.Mesh(this.geometry, this._checker);
//     }
// }

class Checker extends THREE.Mesh {
    constructor() {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const geometry = new THREE.CylinderGeometry(30, 30, 10, 32);
        super(geometry, material);
        console.log(this);
    }

    set checker(color) {
        // this.color.setHex(color);
        console.log(this.material);
        this.material.color.setHex(color);
        if (color == 0x9f003d) this.name = 'redChecker';
        else this.name = 'blueChecker';
    }

    get checker() {
        return this;
    }
}
