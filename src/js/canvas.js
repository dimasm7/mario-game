import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 567

const gravity = 1.5
class Player {
    constructor(){
        this.speed = 10
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
        } 
    }
}

class Platform {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

let player = new Player()
let platforms = []

let genericObjects = []

let keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    },
}

let scrollOffset = 0

function initgame(){
    platformImage = createImage(platform)

    player = new Player()
    platforms = [
        new Platform({
            x: platformImage.width *4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, 
            y: 270,
            image: platformSmallTallImage
        }),
        new Platform({
            x: -1, 
            y: 470, 
            image: platformImage
        }),  
        new Platform({
            x: platformImage.width -3, 
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width *2 + 100, 
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width *3 + 300, 
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width *4 + 300 - 2, 
            y: 470,
            image: platformImage
        }),
        new Platform({
            x: platformImage.width *5 + 700 - 2,
            y: 470,
            image: platformImage
        }),
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(background)
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(hills)
        })
    ]

    scrollOffset = 0
}

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach((genericObject) => {
        genericObject.draw()
    })

    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if(keys.right.pressed && player.position.x < 400){ //maju
        player.velocity.x = player.speed
    }else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) { //balik
        player.velocity.x = -player.speed
    }else{
        player.velocity.x = 0

        if(keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach((genericObject) => {
                genericObject.position.x -= player.speed * .66
            })
        }else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            genericObjects.forEach((genericObject) => {
                genericObject.position.x += player.speed * .66
            })
        }
    }

    //win detect
    if(scrollOffset > platformImage.width *5 + 300 - 2){
        console.log('you win')
    }

    if(player.position.y > canvas.height){
        initgame()
    }

    //deteksi platform
    platforms.forEach((platform) => {
        if(player.position.y + player.height <= platform.position.y //check tinggi player sejajar platform
            && player.position.y + player.height + player.velocity.y >= platform.position.y //check tinggi player mellebihi platform
            && player.position.x + player.width >= platform.position.x // check player di ujung sisi kanan platform
            && player.position.x <= platform.position.x + platform.width){ //check player di ujung kiri platform
            player.velocity.y = 0
        }
    })
}

initgame()
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
            player.velocity.y -= 25
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
            break;
    
        default:
            break;
    }
})