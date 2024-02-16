function onAvatarSelect(event) {
    const file = event.target.files[0];
    const buttonText = document.getElementById('buttonText');
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgElement = new Image();
        imgElement.onload = function() {
            processImage(imgElement);
            buttonText.textContent = "Upload another avatar";
        };
        imgElement.src = e.target.result;
    };
    reader.readAsDataURL(file);
}


function resizeAndCropImage(imgElement, targetWidth, targetHeight) {
    let ratio = Math.max(targetWidth / imgElement.width, targetHeight / imgElement.height);
    let newWidth = imgElement.width * ratio;
    let newHeight = imgElement.height * ratio;

    const resizeCanvas = document.createElement('canvas');
    resizeCanvas.width = newWidth;
    resizeCanvas.height = newHeight;
    let ctx = resizeCanvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, newWidth, newHeight);

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = targetWidth;
    cropCanvas.height = targetHeight;

    let startX = (newWidth - targetWidth) / 2;
    let startY = (newHeight - targetHeight) / 2;

    ctx = cropCanvas.getContext('2d');
    ctx.drawImage(resizeCanvas, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);

    return cropCanvas;
}


function makeOutsideCircleTransparent(canvas, centerX, centerY, radius) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const cw = canvas.width;
    const radiusSquare = radius * radius;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < cw; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            if (dx * dx + dy * dy > radiusSquare) {
                const index = (y * cw + x) * 4;
                data[index + 3] = 0; 
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function convertCanvasToPngUrl(canvas) {
    return canvas.toDataURL('image/png');
}

function processImage(imgElement) {
    const resizedCanvas = resizeAndCropImage(imgElement, 512, 512);

    const centerX = resizedCanvas.width / 2;
    const centerY = resizedCanvas.height / 2;
    const radius = resizedCanvas.width / 2 - 2;
    makeOutsideCircleTransparent(resizedCanvas, centerX, centerY, radius);
    const pngUrl = convertCanvasToPngUrl(resizedCanvas);

    const newImgElement = new Image();
    newImgElement.src = pngUrl;
    newImgElement.classList.add('fade-in');

    const imageDisplay = document.getElementById('imageDisplay');
    imageDisplay.innerHTML = '';
    imageDisplay.appendChild(newImgElement);
}

// function onAvatarSelect(event) {
//     const file = event.target.files[0];
//     const buttonText = document.getElementById('buttonText');
//     if (!file) {
//         return;
//     }

//     const reader = new FileReader();
//     reader.onload = function(e) {
//         const imgElement = new Image();
//         imgElement.onload = function() {
//             const canvas = document.createElement('canvas');
//             canvas.width = imgElement.width;
//             canvas.height = imgElement.height;
//             const ctx = canvas.getContext('2d');

//             if (!checkSize(imgElement, 512, 512)) {
//                 alert("L'image doit être de 512x512 pixels.");
//                 return;
//             }

//             ctx.drawImage(imgElement, 0, 0);

//             if (!withinCircle(ctx, 256, 256, 258)) {
//                 alert("Tous les pixels non-transparents doivent être à l'intérieur d'un cercle de rayon 256 pixels.");
//                 return;
//             }

//             const imageDisplay = document.getElementById('imageDisplay');
//             imageDisplay.innerHTML = '';
//             imgElement.classList.add('fade-in');
//             imageDisplay.appendChild(imgElement);
//         };
//         imgElement.src = e.target.result;
//         buttonText.textContent = "Upload another avatar"
//     };
//     reader.readAsDataURL(file);
// }

// function checkSize(img, width, height) {
//     return img.width === width && img.height === height;
// }


// function withinCircle(ctx, centerX, centerY, radius) {
//     let cw = ctx.canvas.width;
//     let ch = ctx.canvas.height;
//     const imageData = ctx.getImageData(0, 0, cw, ch);
//     const data = imageData.data;

//     let radiusSquare = radius * radius;
//     for (let y = 0; y < ch; y++) {
//         for (let x = 0; x < cw; x++) {
//             const index = (y * cw + x) * 4;
//             if (data[index + 3] > 0) {
//                 const dx = x - centerX;
//                 const dy = y - centerY;
//                 if (dx * dx + dy * dy > radiusSquare) {
//                     return false;
//                 }
//             }
//         }
//     }
//     return true;
// }
