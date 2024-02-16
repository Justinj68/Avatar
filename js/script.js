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
            const canvas = document.createElement('canvas');
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            const ctx = canvas.getContext('2d');

            if (!checkSize(imgElement, 512, 512)) {
                alert("L'image doit être de 512x512 pixels.");
                return;
            }

            ctx.drawImage(imgElement, 0, 0);

            if (!withinCircle(ctx, 256, 256, 258)) {
                alert("Tous les pixels non-transparents doivent être à l'intérieur d'un cercle de rayon 256 pixels.");
                return;
            }

            const imageDisplay = document.getElementById('imageDisplay');
            imageDisplay.innerHTML = '';
            imgElement.classList.add('fade-in');
            imageDisplay.appendChild(imgElement);
        };
        imgElement.src = e.target.result;
        buttonText.textContent = "Upload another avatar"
    };
    reader.readAsDataURL(file);
}

function checkSize(img, width, height) {
    return img.width === width && img.height === height;
}


function withinCircle(ctx, centerX, centerY, radius) {
    let cw = ctx.canvas.width;
    let ch = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, cw, ch);
    const data = imageData.data;

    let radiusSquare = radius * radius;
    for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
            const index = (y * cw + x) * 4;
            if (data[index + 3] > 0) {
                const dx = x - centerX;
                const dy = y - centerY;
                if (dx * dx + dy * dy > radiusSquare) {
                    return false;
                }
            }
        }
    }
    return true;
}
