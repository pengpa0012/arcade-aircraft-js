kaboom({
    background: [ 255, 255, 255, ]
})

loadSprite("player", "./assets/aircraft.png")
loadSprite("enemy", "./assets/enemy.png")
loadSprite("bullet", "./assets/bullet.png")

const player = add([
    sprite("player"),
    pos(width() / 2, height() - 100),
])

const enemy = add([
    sprite("enemy"),
    pos(500, -100)
])

enemy.onUpdate(() => {
    if(enemy.pos.y >= height()) {
        enemy.pos.y = -100
        enemy.pos.x = rand(0, width() - 100)
    }
    enemy.move(0, 300)
})

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

        // check if bullet is out of screen
        if(bullet.pos.y <= 0) {
            destroy(bullet)
        }

        // check collision on enemy and reset pos
        if(((bullet.pos.x - enemy.pos.x >= 0) && (bullet.pos.x - enemy.pos.x <= 100)) && ((bullet.pos.y - enemy.pos.y >= 0) && (bullet.pos.y - enemy.pos.y <= 100))) {
            destroy(bullet)
            enemy.pos.y = -100
            enemy.pos.x = rand(0, width() - 100)
        }
    })
})