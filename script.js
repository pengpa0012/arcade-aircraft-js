kaboom({
    background: [ 255, 255, 255, ]
})

loadSprite("player", "./assets/images/aircraft.png")
loadSprite("enemy", "./assets/images/enemy.png")
loadSprite("bullet", "./assets/images/bullet.png")
loadSprite("heart", "./assets/images/heart.png")
loadSprite("menu-bg", "./assets/images/menu-bg.jpg")    
loadSprite("ammo", "./assets/images/ammo.png")
loadSound("shoot", "./assets/sfx/shoot.mp3")
loadSound("hurt", "./assets/sfx/hurt.mp3")
loadSound("explode", "./assets/sfx/explode.ogg")
let isGameStart = false
let ammoPowerUps = false

scene("menu", () => {
    const bg = add([
        sprite("menu-bg"),
        pos(0,0),
        scale(0.5),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(1),
        fixed(),
        "bg"
    ])

    bg.scaleTo(Math.max(
        width() / 1914,
        height() / 1251
    ))

    add([
        text("Arcade Aircraft"),
        pos(width() / 2, (height() - 100) / 2),
        anchor("center"),
        color(0,0,0),
    ])
    add([
        text("Press SPACE to start", {size: 20}),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(0,0,0),
    ])

    onKeyPress("space", () => {
        go("start")
    })
})

go("menu")

scene("score", (score) => {
    const bg = add([
        sprite("menu-bg"),
        pos(0,0),
        scale(0.5),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(1),
        fixed()
    ])

    bg.scaleTo(Math.max(
        width() / 1914,
        height() / 1251
    ))
    add([
        text(`Your Score: ${score}`),
        pos(width() / 2, (height() - 100) / 2),
        color(0,0,0),
        anchor("center"),
        area(),
    ])

    add([
        text("Press SPACE to restart", {size: 20}),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(0,0,0),
    ])

    onKeyPress("space", () => {
        go("start")
    })
})


scene("start", () => {
    setBackground(127,205,255)
    const player = add([
        sprite("player"),
        pos(width() / 2, height() - 100),
        area(),
        health(5),
        "player"
    ])
    
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
    
    function spawnPowerUps() {
        const randomize = rand(0, 5)
        add([
            sprite(randomize > 1 ? "ammo" : "heart"),
            pos(rand(0, width() - 100), -100),
            area(),
            "power_ups"
        ])
    }
    
    onUpdate("power_ups", (power_ups) => {
        if(power_ups.pos.y >= height()) {
            destroy(power_ups)
        }
        power_ups.move(0, 80)
    })
    
    function spawnEnemy() {
        add([
            sprite("enemy"),
            pos(rand(0, width() - 100), -100),
            area(),
            // add enemy health every 400 score
            health(score.value > 400 ? score.value / 400 : 1),
            "enemy",
        ])
        const ticker = 3 - (score.value / 100)
        wait(ticker < 1 ? 1 : ticker, spawnEnemy)
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

        if(ammoPowerUps) {
            add([
                sprite("bullet"),
                pos(player.pos.x + 32, player.pos.y),
                area(),
                "bullet",
                {
                    dir: "right"
                }
            ])
            add([
                sprite("bullet"),
                pos(player.pos.x + 32, player.pos.y),
                area(),
                "bullet",
                {
                    dir: "left"
                }
            ])
        }

        play("shoot", {volume: 0.1})
        if(player.hp() > 0) {
            const ticker = 1 - (score.value / 1000)
            wait(ticker < 0.09 ? 0.09 : ticker, spawnBullet)
        }
    }
    
    spawnBullet()
    
    onUpdate("bullet", (bullet) => {
        if(ammoPowerUps) {
            setTimeout(() => {
                ammoPowerUps = false
            }, 10000)
        }
        if(bullet.dir == "left") {
            bullet.move(-500, -1000)
        } else if(bullet.dir == "right") {
            bullet.move(500, -1000)
        } else {
            bullet.move(0, -1000)
        }
        
        if(bullet.pos.y <= -100) {
            destroy(bullet)
        }
    })
    
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
        enemy.hurt(1)
        if(enemy.hp() <= 0) {
            destroy(enemy)
            play("explode")

            score.text = "Score: " + (score.value += randi(10, 15))

            // spawn power ups
            const randomize = rand(0, 100)
            if(randomize < 5) {
                spawnPowerUps()
            }
        }
        destroy(bullet)
    })
    
    onCollide("player", "enemy", () => {
        player.hurt(1)
        play("hurt")
        life.text = "Life: " + player.hp()
        if(player.hp() <= 0) {
            go("score", score.value)
        }
    })
    
    onCollide("player", "power_ups", (_, power_ups) => {
        const isHeart = power_ups.width == 64
        if(isHeart) {
            player.heal(1)
            life.text = "Life: " + player.hp()
        } else {
            // update fire rate
            ammoPowerUps = true
        }
        destroy(power_ups)
    })
    
    onCollide("player", "enemy_bullet", (_, enemy_bullet) => {
        player.hurt(1)
        play("hurt")
        life.text = "Life: " + player.hp()
        destroy(enemy_bullet)
        if(player.hp() <= 0) {
            go("score", score.value)
        }
    })
})

// TO ADD:
// -add explosion on enemy death
// -background parallax
// -add dash, shield