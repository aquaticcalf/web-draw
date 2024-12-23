let isDrawing = false
let canvas = null
let ctx = null
let lastX = 0
let lastY = 0
let color = '#FF0000'
let lineWidth = 3

function createCanvas() {

    canvas = document.createElement('canvas')
    canvas.className = 'drawing-canvas'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')

    const controls = document.createElement('div')
    controls.className = 'drawing-controls'
    controls.innerHTML = `
    <input type="color" id="colorPicker" value="#FF0000">
    <input type="range" id="widthSlider" min="1" max="10" value="3">
    <button id="clearBtn">Clear</button>
    <button id="closeBtn">Close</button>
  `
    document.body.appendChild(controls)

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)

    document.getElementById('colorPicker').addEventListener('change', e => color = e.target.value)
    document.getElementById('widthSlider').addEventListener('change', e => lineWidth = e.target.value)
    document.getElementById('clearBtn').addEventListener('click', clearCanvas)
    document.getElementById('closeBtn').addEventListener('click', deactivateDrawing)
}

function startDrawing(e) {
    isDrawing = true
    [lastX, lastY] = [e.clientX, e.clientY]
}

function draw(e) {
    if (!isDrawing) return
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.clientX, e.clientY)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()
    [lastX, lastY] = [e.clientX, e.clientY]
}

function stopDrawing() {
    isDrawing = false
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function activateDrawing() {
    if (!canvas) createCanvas()
    canvas.classList.add('drawing-active')
    document.querySelector('.drawing-controls').style.display = 'block'
}

function deactivateDrawing() {
    canvas.classList.remove('drawing-active')
    document.querySelector('.drawing-controls').style.display = 'none'
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "toggle") {
        if (canvas && canvas.classList.contains('drawing-active')) {
            deactivateDrawing()
        } else {
            activateDrawing()
        }
    }
})
