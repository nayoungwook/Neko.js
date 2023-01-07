var Mathf = /** @class */ (function () {
    function Mathf() {
    }
    Mathf.getDistance = function (v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    };
    return Mathf;
}());
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector;
}());
var Camera = /** @class */ (function () {
    function Camera() {
    }
    Camera.position = new Vector(0, 0, 1);
    Camera.rotation = 0;
    return Camera;
}());
var Sprite = /** @class */ (function () {
    function Sprite(path) {
        this.path = path;
        this.image = new Image();
        this.image.src = path;
    }
    Sprite.prototype.getPath = function () {
        return this.path;
    };
    return Sprite;
}());
var GameObject = /** @class */ (function () {
    function GameObject(x, y, width, height) {
        this.position = new Vector(x, y, 1);
        this.renderPosition = new Vector(0, 0, 1);
        this.anchor = new Vector(0.5, 0.5);
        this.rotation = 0;
        this.width = width != undefined ? width : 100;
        this.height = height != undefined ? height : 100;
    }
    GameObject.prototype.tick = function () { };
    GameObject.prototype.render = function () {
        App.renderQueue.push(this);
    };
    GameObject.prototype._render = function () {
        this.renderWidth = this.width * Camera.position.z;
        this.renderHeight = this.height * Camera.position.z;
        var _dist = Mathf.getDistance(new Vector(App.canvas.width / 2 + Camera.position.x, App.canvas.height / 2 + Camera.position.y), new Vector(this.position.x, this.position.y));
        var _rot = Math.atan2(App.canvas.height / 2 + Camera.position.y - this.position.y, App.canvas.width / 2 + Camera.position.x - this.position.x) + Camera.rotation;
        var xx = (this.position.x - (App.canvas.width / 2 + Camera.position.x));
        var yy = (this.position.y - (App.canvas.height / 2 + Camera.position.y));
        var _zDist = _dist * (Camera.position.z);
        var _zx = (Math.cos(_rot) * _zDist), _zy = (Math.sin(_rot) * _zDist);
        this.renderPosition.x = this.position.x - Camera.position.x - (xx + _zx);
        this.renderPosition.y = this.position.y - Camera.position.y - (yy + _zy);
        var outScreenSize = Math.sqrt(this.renderWidth * this.renderWidth + this.renderHeight * this.renderHeight);
        this.inScreen = true;
        if (this.position.x < -outScreenSize || this.position.x > App.canvas.width + outScreenSize)
            this.inScreen = false;
        if (this.position.y < -outScreenSize || this.position.y > App.canvas.width + outScreenSize)
            this.inScreen = false;
        App.ctx.save();
        App.ctx.translate(this.renderPosition.x, this.renderPosition.y);
        App.ctx.rotate(this.rotation + Camera.rotation);
        if (this.sprite != null) {
            App.ctx.drawImage(this.sprite.image, -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);
        }
        App.ctx.restore();
    };
    return GameObject;
}());
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        App.canvas = this.createCanvas();
        document.body.appendChild(App.canvas);
        document.body.style.margin = '0px';
        document.body.style.border = '0px';
        this.init();
        setInterval(function () { _this._update(); }, 1000 / 60);
    }
    App.prototype._resize = function () {
        App.canvas.width = window.innerWidth;
        App.canvas.height = window.innerHeight;
    };
    App.prototype._update = function () {
        this._resize();
        this.tick();
        App.renderQueue = [];
        this.render();
        App.renderQueue = App.renderQueue.sort(function (fir, sec) {
            return fir.position.z - sec.position.z;
        });
        for (var i = 0; i < App.renderQueue.length; i++) {
            App.renderQueue[i]._render();
        }
    };
    App.prototype.init = function () { };
    App.prototype.tick = function () { };
    App.prototype.render = function () { };
    App.prototype.createCanvas = function () {
        var _canvas = document.createElement('canvas');
        _canvas.id = 'canvas';
        _canvas.width = 600;
        _canvas.height = 600;
        App.ctx = _canvas.getContext('2d');
        return _canvas;
    };
    return App;
}());
