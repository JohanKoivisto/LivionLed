// AUTHOR: Johan Koivisto

//setup canvas and variables
const canvas = document.getElementById('led-display')
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#2d2d2d'
ctx.fillRect(0, 0, canvas.width, canvas.height)
let savedEmoji = document.getElementById('saved-emoji')

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

// Function to generate led block
const block = (x, y, width, height, color, contxt = ctx) => {
  contxt.fillStyle = color
  contxt.fillRect(x, y, width, height)
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

// set grid to initial state
const initalizeLedArray = () => {
  ledArray = ledArray.map(el => [0, 0, 0, 0, 0, 0, 0, 0])
}

// save emojis to database
const saveEmoji = () => {
  event.preventDefault()
  let emojiName = document.getElementById('emoji-name').value
  if (emojiName === "") {
    alert("you must give your emoji a name");
  } else {
    db.collection('emojis').add({
      name: emojiName,
      emojimap: arrToJSON(ledArray)
    })
  }
  
}
// create minicanvas to display saved emoji in a grid
const createMiniCanvas = doc => {
  // create Dom elements
  const newDiv = document.createElement("div")
  const newCanvas = document.createElement('canvas')
  const newP = document.createElement("p")
  
  // add classlist and define canvas
  newDiv.classList.add("minicanvas")
  newP.textContent = doc.data().name;
  newCanvas.id = doc.id
  newCanvas.width = 120
  newCanvas.height = 120
  let cty = newCanvas.getContext('2d')
  cty.fillStyle = '#2d2d2d'
  cty.fillRect(0, 0, newCanvas.width, newCanvas.height)
  ledArray = parseLedArray(doc.data().emojimap)

  // append everything to emoji div
  savedEmoji.appendChild(newDiv)
  newDiv.appendChild(newCanvas)
  newDiv.appendChild(newP)
  
  //draw minicanvas
  drawLedDisplay(cty, 14, 14, 120, 120)
}

// get emoji data and render each one to minicanvas, listen to changes
db.collection("emojis").orderBy("name").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type === "added") {
      createMiniCanvas(change.doc)
    }
    initalizeLedArray()
  })
})

drawLedDisplay(ctx, 59, 59, 480, 480)
