// AUTHOR: Johan Koivisto

//setup canvas and variables
const canvas = document.getElementById('led-display')
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#2d2d2d'
ctx.fillRect(0, 0, canvas.width, canvas.height)
let savedEmoji = document.getElementById('saved-emoji')

ledArray = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

// Define look for led block
const block = (x, y, width, height, color, contxt = ctx) => {
  contxt.fillStyle = color
  contxt.fillRect(x, y, width, height);
}

// Get coordinates, map to ledArray, toggle block on/off and call draw function to update DOM
canvas.addEventListener('click', function (e) {
  let cRect = canvas.getBoundingClientRect() // Gets CSS pos, and width/height
  let canvasX = Math.round(e.clientX - cRect.left)
  let canvasY = Math.round(e.clientY - cRect.top)
  let arrX = Math.floor(canvasX / 60) // convert coords to array index
  let arrY = Math.floor(canvasY / 60)

  ledArray[arrY][arrX] === 0
    ? (ledArray[arrY][arrX] = 1)
    : (ledArray[arrY][arrX] = 0)

  drawLedDisplay(ctx, 59, 59, 480, 480)
})

const drawLedDisplay = (contxt, blockWidth, blockHeight, canvasHeight, canvasWidth) => {
  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 8; k++) {
      // draw blocks on/off based on array values
      if (ledArray[k][i] === 0) {
        block(i * (canvasHeight / 8), k * (canvasWidth / 8), blockWidth, blockHeight, 'black', contxt)
      } else {
        block(i * (canvasHeight / 8), k * (canvasWidth / 8), blockWidth, blockHeight, '#5fd3ff', contxt)
      }
    }
  }
}

// firebase doesnt support nested arrays(???) so convert ledArray to JSON
const arrToJSON = arr => {
  return JSON.stringify(arr)
}

// convert JSON back to array
const parseLedArray = str => {
  return JSON.parse(str)
}

console.log(arrToJSON(ledArray));

// save emojis to database
const saveEmoji = () => {
  event.preventDefault()
  let emojiName = document.getElementById('emoji-name').value
  db.collection('emojis').add({
    name: emojiName,
    emojimap: arrToJSON(ledArray)
  })
}

// get data
db.collection('emojis')
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      const newCanvas = document.createElement('canvas')
      newCanvas.id = doc.id
      newCanvas.width = 120
      newCanvas.height = 120
      savedEmoji.appendChild(newCanvas)
      let cty = newCanvas.getContext('2d')
      cty.fillStyle = '#2d2d2d'
      cty.fillRect(0, 0, newCanvas.width, newCanvas.height)
      ledArray = parseLedArray(doc.data().emojimap)
      drawLedDisplay(cty, 14, 14, 120, 120)
    })
  })

  drawLedDisplay(ctx, 59, 59, 480, 480)
