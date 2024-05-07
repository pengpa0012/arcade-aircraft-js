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
    // move
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

// shoot
onKeyPress("space", () => {
    const bullet = add([
        sprite("bullet"),
        pos(0,0)
    ])
    bullet.pos.x = player.pos.x + 32
    bullet.pos.y = player.pos.y
    bullet.onUpdate(() => {
        bullet.move(0, -1000)
        if(bullet.pos.y <= 0) {
            destroy(bullet)
        }
    })
})