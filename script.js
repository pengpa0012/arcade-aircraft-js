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

function spawnEnemy() {
    add([
        sprite("enemy"),
        pos(rand(0, width() - 100), -100),
        area(),
        "enemy"
    ])
    wait(3, spawnEnemy)
}

spawnEnemy()

onUpdate("enemy", (enemy) => {
	if(enemy.pos.y >= height()) {
		destroy(enemy)
	}
	enemy.move(0, 100)
})

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

player.onUpdate(() => {
    // if(life.value <= 0) return

    // move
    if (isKeyDown("w")) {
        if(player.pos.y <= 0) {
            player.move(0, 0)
        } else {
            player.move(0, -500)
        }
    }
    if (isKeyDown("a")) {
        if(player.pos.x <= 0) {
            player.move(0, 0)
        } else {
            player.move(-500, 0)
        }
    }
    if (isKeyDown("s")) {
        if(player.pos.y >= height() - player.height) {
            player.move(0, 0)
        } else {
            player.move(0, 500)
        }
    }
    if (isKeyDown("d")) {
        if(player.pos.x >= width() - player.width) {
            player.move(0, 0)
        } else {
            player.move(500, 0)
        }
    }
})

onCollide("player", "enemy", () => {
    life.value -= 1
    life.text = "Life: " + life.value
})

function spawnBullet() {
	add([
        sprite("bullet"),
        pos(player.pos.x + 32, player.pos.y),
		"bullet"
    ])
    wait(0.05, spawnBullet)
}

spawnBullet()

onUpdate("bullet", (bullet) => {
	bullet.move(0, -1000)
	// check if bullet is out of screen
	if(bullet.pos.y <= 0) {
		destroy(bullet)
	}
})

onCollide("bullet", "enemy", () => {
	console.log("yeye")
})

// TO ADD:
// -fix bullet collision
// -add explosion on enemy death
// -background parallax
// -sfx
// -power ups/bullet
// -enemy bullet