class Checker{
    constructor(){
        console.log('const')
        this._checker = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.geometry = new THREE.CylinderGeometry(30, 30, 10, 32);
    }

    set checker(color){
        this._checker.color.setHex(color);
    }

    get checker(){
        return new THREE.Mesh(this.geometry, this._checker);
    }
}