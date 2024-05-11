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
	health(5),
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

function spawnEnemyBullet() {
    // if(player.hp() <= 0) return
	const enemies = get("enemy")

	enemies.forEach(enemy => {
		add([
			sprite("bullet"),
			pos(enemy.pos.x + 40, enemy.pos.y + enemy.height),
			area(),
			"enemy_bullet"
		])
	})
	wait(2.5, spawnEnemyBullet)
}

spawnEnemyBullet()

onUpdate("enemy_bullet", (enemy_bullet) => {
	if(enemy_bullet.pos.y >= height()) {
		destroy(enemy_bullet)
	}
	enemy_bullet.move(0, 500)
})

function spawnBullet() {
    // if(player.hp() <= 0) return
	add([
        sprite("bullet"),
        pos(player.pos.x + 32, player.pos.y),
		area(),
		"bullet"
    ])
    if(player.hp() > 0) {
        wait(1, spawnBullet)
    }
}

spawnBullet()

onUpdate("bullet", (bullet) => {
	bullet.move(0, -1000)
	if(bullet.pos.y <= -100) {
		destroy(bullet)
	}
})

const score = add([
    text("Score: 0"),
    color(0, 0, 0),
    pos(50, 50),
	z(100),
    { value: 0 },
])
const life = add([
    text("Life: 5"),
    color(0, 0, 0),
    pos(50, 100),
	z(100),
    { value: player.hp() },
])

player.onUpdate(() => {
    // if(player.hp() <= 0) return

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

onCollide("bullet", "enemy", (bullet, enemy) => {
    // add explosion here
	destroy(bullet)
	destroy(enemy)
	score.text = "Score: " + (score.value += 10)
})

onCollide("player", "enemy", () => {
    player.hurt(1)
    life.text = "Life: " + player.hp()
})

onCollide("player", "enemy_bullet", (_, enemy_bullet) => {
    player.hurt(1)
    life.text = "Life: " + player.hp()
    destroy(enemy_bullet)
    if(player.hp() == 0) {
        destroy(player)
    }
})

// TO ADD:
// -add explosion on enemy death
// -background parallax
// -sfx
// -power ups/bullet