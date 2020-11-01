// AUTHOR: Johan Koivisto

var canvas = document.getElementById('led-display')
var ctx = canvas.getContext('2d')
ctx.fillStyle = '#2d2d2d'
ctx.fillRect(0, 0, canvas.width, canvas.height)
const blockWidth = 59
const blockHeight = 59

ledArray = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

// Define block
const block = (x, y, width, height, color) => {
  ctx.beginPath()
  ctx.lineWidth = '1'
  ctx.fillStyle = color
  ctx.rect(x, y, width, height)
  ctx.fill()
}

// Get coordinates, map to array, toggle block on/off and call draw function to update DOM
canvas.addEventListener('click', function (e) {
  let cRect = canvas.getBoundingClientRect() // Gets CSS pos, and width/height
  let canvasX = Math.round(e.clientX - cRect.left) // Subtract the 'left' of the canvas
  let canvasY = Math.round(e.clientY - cRect.top) // from the X/Y positions to make
  let arrX = Math.floor(canvasX / 60) // convert to array index
  let arrY = Math.floor(canvasY / 60)

  ledArray[arrY][arrX] === 0
    ? (ledArray[arrY][arrX] = 1)
    : (ledArray[arrY][arrX] = 0)

  drawLedDisplay()
})

const drawLedDisplay = () => {
  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 8; k++) {
      if (ledArray[k][i] === 0) {
        block(i * 60, k * 60, blockWidth, blockHeight, 'black')
      } else {
        block(i * 60, k * 60, blockWidth, blockHeight, '#5fd3ff')
      }
    }
  }
}

drawLedDisplay()
