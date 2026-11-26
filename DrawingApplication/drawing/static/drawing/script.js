// Get HTML elements
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const shapeSelect = document.getElementById("shape");
const colorPicker = document.getElementById("color");
const widthSlider = document.getElementById("width");
const eraserButton = document.getElementById("eraser");
const clearButton = document.getElementById("clear");

// Drawing variables
let isDrawing = false;
let startX = 0;
let startY = 0;
let snapshot = null;
let eraserMode = false;

// Get mouse position
function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

// Start drawing
canvas.addEventListener("pointerdown", function(event) {

    isDrawing = true;

    const position = getPosition(event);

    startX = position.x;
    startY = position.y;

    snapshot = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    canvas.setPointerCapture(event.pointerId);

    if (shapeSelect.value === "freehand" || eraserMode) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }

});

// Draw while moving the mouse
canvas.addEventListener("pointermove", function(event) {

    if (!isDrawing) return;

    const position = getPosition(event);

    const currentX = position.x;
    const currentY = position.y;

    ctx.lineWidth = Number(widthSlider.value);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (eraserMode) {

        ctx.globalCompositeOperation = "destination-out";
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        return;

    }

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colorPicker.value;

    const selectedShape = shapeSelect.value;

    if (selectedShape === "freehand") {

        ctx.lineTo(currentX, currentY);
        ctx.stroke();

    }

    else {

        // Restore canvas before drawing preview
        ctx.putImageData(snapshot, 0, 0);

        ctx.beginPath();

        if (selectedShape === "line") {

            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);

        }

        else if (selectedShape === "rectangle") {

            ctx.rect(
                startX,
                startY,
                currentX - startX,
                currentY - startY
            );

        }

        else if (selectedShape === "circle") {

            const radius = Math.sqrt(
                Math.pow(currentX - startX, 2) +
                Math.pow(currentY - startY, 2)
            );

            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);

        }

        ctx.stroke();

    }

});

// Stop drawing
canvas.addEventListener("pointerup", function() {

    isDrawing = false;
    ctx.globalCompositeOperation = "source-over";

});

// Handle pointer leaving the canvas
canvas.addEventListener("pointercancel", function() {

    isDrawing = false;
    ctx.globalCompositeOperation = "source-over";

});

// Eraser button
eraserButton.addEventListener("click", function() {

    eraserMode = !eraserMode;

    if (eraserMode) {
        eraserButton.textContent = "Eraser ON";
    } else {
        eraserButton.textContent = "Eraser OFF";
    }

});

// Clear canvas button
clearButton.addEventListener("click", function() {

    ctx.clearRect(
        0, 0, canvas.width, canvas.height
    );

});