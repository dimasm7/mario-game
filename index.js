const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 1.5
class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        
        if(this.position.y + this.velocity.y + this.height <= canvas.height){
            this.velocity.y += gravity
        }else{
            this.velocity.y = 0
        } 
    }
}

class Platform {
    constructor({x, y}){
        this.position = {
            x,
            y
        }
        this.width = 200
        this.height = 20
    }

    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
const platforms = [new Platform({x: 200, y: 100}),  new Platform({x: 500, y: 200})]

const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    },
}

function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = 5
    }else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    }else{
        player.velocity.x = 0

        platforms.forEach(platform => {
            if(keys.right.pressed){
                platform.position.x -= 5
            }else if(keys.left.pressed){
                platform.position.x += 5
            }
        })
    }

    //deteksi platform
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y //check tinggi player sejajar platform
            && player.position.y + player.height + player.velocity.y >= platform.position.y //check tinggi player mellebihi platform
            && player.position.x + player.width >= platform.position.x // check player di ujung sisi kanan platform
            && player.position.x <= platform.position.x + platform.width){ //check player di ujung kiri platform
            player.velocity.y = 0
        }
    })
}
animate()

addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = true
            break;
        case 83:
            console.log('down')
            break;
        case 68:
            keys.right.pressed = true
            break;
        case 87:
            player.velocity.y -= 20
            break;
        
        default:
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = false
            break;
        case 83:
            console.log('down')
            break;
        case 68:
            keys.right.pressed = false
            break;
        case 87:
            player.velocity.y -= 20
            break;
    
        default:
            break;
    }
})