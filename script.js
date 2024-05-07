kaboom({
    background: [ 255, 255, 255, ]
})

loadSprite("player", "./assets/aircraft.png")
loadSprite("enemy", "./assets/enemy.png")
loadSprite("bullet", "./assets/bullet.png")

const player = add([
    sprite("player"),
    pos(width() / 2, height() - 100),
    area(),
    "player"
])

const enemy = add([
    sprite("enemy"),
    pos(500, -100),
    area(),
    "enemy"
])


const score = add([
    text("Score: 0"),
    color(0, 0, 0),
    pos(50, 50),
    { value: 0 },
])

const life = add([
    text("Life: 5"),
    color(0, 0, 0),
    pos(50, 100),
    { value: 5 },
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
        player.move(0, -500)
    }
    if (isKeyDown("a")) {
        player.move(-500, 0)
    }
    if (isKeyDown("s")) {
        player.move(0, 500)
    }
    if (isKeyDown("d")) {
        player.move(500, 0)
    }
})

onCollide("player", "enemy", () => {
    life.value -= 1
    life.text = "Life: " + life.value
    enemy.pos.y = -100
    enemy.pos.x = rand(0, width() - 100)
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
            score.value += 5
            score.text = "Score: " + score.value
        }
    })
})

// TO ADD:
// -player max x and y
// -enemy spawn rate
// -add explosion on enemy death
// -background parallax
// -sfx
// -power ups/bullet
// -enemy bullet