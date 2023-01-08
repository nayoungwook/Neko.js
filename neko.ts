class Mathf {
    static getDistance(v1: Vector, v2: Vector): number {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
}

class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = (a == undefined ? 1 : a);
    }

    public getString(): string {
        return `(${this.r},${this.g},${this.b})${this.a})`;
    }

}

class Vector {

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Camera {
    public static position: Vector = new Vector(0, 0, 1);
    public static rotation: number = 0;
}

class Sprite {
    private path: string;
    public image: HTMLImageElement;

    constructor(path) {
        this.path = path;
        this.image = new Image();
        this.image.src = path;
    }

    public getPath(): string {
        return this.path;
    }
}

class GameObject {

    public position: Vector;
    public renderPosition: Vector;
    public anchor: Vector;
    public rotation: number;
    public width: number;
    public height: number;
    public inScreen: boolean;
    public renderWidth: number;
    public renderHeight: number;
    public sprite: Sprite;
    public renderType: string = 'image';
    public color: Color;

    constructor(x: number, y: number, width?: number, height?: number) {
        this.position = new Vector(x, y, 1);
        this.renderPosition = new Vector(0, 0, 1);
        this.anchor = new Vector(0.5, 0.5);
        this.color = new Color(255, 40, 150, 1);

        this.rotation = 0;
        this.width = width != undefined ? width : 100;
        this.height = height != undefined ? height : 100;
    }

    public tick(): void { }

    public render(): void {
        App.renderQueue.push(this);
    }

    public _render(): void {
        this.renderWidth = this.width * Camera.position.z;
        this.renderHeight = this.height * Camera.position.z;

        let _dist = Mathf.getDistance(new Vector(App.canvas.width / 2 + Camera.position.x, App.canvas.height / 2 + Camera.position.y), new Vector(this.position.x, this.position.y));
        let _rot = Math.atan2(App.canvas.height / 2 + Camera.position.y - this.position.y, App.canvas.width / 2 + Camera.position.x - this.position.x) + Camera.rotation;
        let xx = (this.position.x - (App.canvas.width / 2 + Camera.position.x));
        let yy = (this.position.y - (App.canvas.height / 2 + Camera.position.y));
        let _zDist = _dist * (Camera.position.z);

        let _zx = (Math.cos(_rot) * _zDist), _zy = (Math.sin(_rot) * _zDist);

        this.renderPosition.x = this.position.x - Camera.position.x - (xx + _zx);
        this.renderPosition.y = this.position.y - Camera.position.y - (yy + _zy);

        let outScreenSize = Math.sqrt(this.renderWidth * this.renderWidth + this.renderHeight * this.renderHeight);
        this.inScreen = true;
        if (this.position.x < -outScreenSize || this.position.x > App.canvas.width + outScreenSize)
            this.inScreen = false;
        if (this.position.y < -outScreenSize || this.position.y > App.canvas.width + outScreenSize)
            this.inScreen = false;

        App.ctx.save();

        App.ctx.translate(this.renderPosition.x, this.renderPosition.y);
        App.ctx.rotate(this.rotation + Camera.rotation);

        if (this.renderType == 'image') {
            if (this.sprite != null) {
                App.ctx.drawImage(this.sprite.image, -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);
            }
        } else if (this.renderType == 'rect') {
            App.ctx.fillStyle = this.color.getString();
            App.ctx.fillRect(-this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight);
        }

        App.ctx.restore();
    }

}

class Renderer {

}

class App {

    public static canvas: HTMLCanvasElement;
    public static ctx: CanvasRenderingContext2D;
    public static renderQueue: Array<GameObject>;

    constructor() {
        App.canvas = this.createCanvas();
        document.body.appendChild(App.canvas);
        document.body.style.margin = '0px';
        document.body.style.border = '0px';

        this.init();
        setInterval(() => { this._update(); }, 1000 / 60);
    }

    private _resize(): void {
        App.canvas.width = window.innerWidth;
        App.canvas.height = window.innerHeight;
    }

    private _update(): void {
        this._resize();
        this.tick();

        App.renderQueue = [];
        this.render();

        App.renderQueue = App.renderQueue.sort(function (fir, sec) {
            return fir.position.z - sec.position.z;
        });

        for (let i = 0; i < App.renderQueue.length; i++) {
            App.renderQueue[i]._render();
        }
    }

    public init(): void { }
    public tick(): void { }
    public render(): void { }

    private createCanvas(): HTMLCanvasElement {
        let _canvas = document.createElement('canvas');
        _canvas.id = 'canvas';
        _canvas.width = 600;
        _canvas.height = 600;
        App.ctx = _canvas.getContext('2d')!;
        return _canvas;
    }
}