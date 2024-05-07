kaboom({
    background: [ 255, 255, 255, ]
})

loadSprite("player", "./assets/aircraft.png")
loadSprite("bullet", "./assets/bullet.png")

const player = add([
    sprite("player"),
    pos(width() / 2, height() - 100),
])

player.onUpdate(() => {
    if (isKeyDown("w")) {
        player.move(0, -300)
    }
    if (isKeyDown("a")) {
        player.move(-300, 0)
    }
    if (isKeyDown("s")) {
        player.move(0, 300)
    }
    if (isKeyDown("d")) {
        player.move(300, 0)
    }
})