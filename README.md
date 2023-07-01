# Neko.JS
a light-way javascript game engine (dev)

# Version
## 0.1

App class
basic rendering

    let app = new App();

    app.render = () => {}
    app.tick = () => {}

game object

    let object = new GameObject(100, 100);
    object.sprite = new Sprite("image path");

    app.render = () => {
        object.render();
    }

vector

    let vec = new Vector();
    vec.x += 1;

Camera

    Camera.position.x += 2;

    //zoom
    Camera.position.z += 0.01;
