// AUTHOR: Johan Koivisto

//setup canvas and variables
const canvas = document.getElementById('led-display')
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#2d2d2d'
ctx.fillRect(0, 0, canvas.width, canvas.height)
const blockWidth = 59
const blockHeight = 59
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
  contxt.beginPath()
  contxt.lineWidth = '1'
  contxt.fillStyle = color
  contxt.rect(x, y, width, height)
  contxt.fill()
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

  drawLedDisplay(ctx)
})

const drawLedDisplay = contxt => {
  for (let i = 0; i < 8; i++) {
    for (let k = 0; k < 8; k++) {
      // draw blocks on/off based on array values
      if (ledArray[k][i] === 0) {
        block(i * 60, k * 60, blockWidth, blockHeight, 'black', contxt)
      } else {
        block(i * 60, k * 60, blockWidth, blockHeight, '#5fd3ff', contxt)
      }
    }
  }
}

// firebase doesnt support nested arrays(???) so convert ledArray to string
const ArrToString = arr => {
  let arrString = arr.join('')
  return arrString.replace(/[,]/g, '')
}

// and here we convert string back to ledArray format
const mapString = str => {
  strArr = []
  str = str.split('')
  for (let i = 0; i < 64; i += 8) {
    strArr.push(str.slice(i, i + 8))
  }
  return strArr
}

// render saved emojis to dom
/* const renderSavedEmoji = () => {
  const canvas2 = document.getElementById('emoji-test')
  const cty = canvas2.getContext('2d')
  cty.fillStyle = '#2d2d2d'
  cty.fillRect(0, 0, canvas2.width, canvas2.height)

  drawLedDisplay(cty)
} */

// save emojis to database
const saveEmoji = () => {
  event.preventDefault()
  let emojiName = document.getElementById('emoji-name').value
  console.log(emojiName)
  /* db.collection('emojis').add({
    name: emojiName,
    emojimap: ArrToString(ledArray)
  }) */
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

      drawLedDisplay(cty)
    })
  })

drawLedDisplay()
