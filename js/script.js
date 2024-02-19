const IMAGE_SIZE = 512;
let imgLoaded = null;

function onAvatarSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            processImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}



function processImage(img) {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (canvas.classList.contains('fade-in')) {
        canvas.classList.remove('fade-in');
    }
    void canvas.offsetWidth;
    canvas.classList.add('fade-in');

    canvas.width = IMAGE_SIZE;
    canvas.height = IMAGE_SIZE;
    if (!checkSize(img, IMAGE_SIZE, IMAGE_SIZE)) {
        alert("The image is not the correct size. It will be resized.");
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imgLoaded = img;

    makeOutsideCircleTransparent(ctx);
    evaluateHappyFeeling(ctx);
}



function checkSize(img, width, height) {
    return img.width === width && img.height === height;
}

function makeOutsideCircleTransparent(ctx) {
    const radius = IMAGE_SIZE / 2;
    const radiusSquare = radius * radius;
    const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    const data = imageData.data;

    let invalid = false;

    for (let y = 0; y < IMAGE_SIZE; y++) {
        for (let x = 0; x < IMAGE_SIZE; x++) {
            const dx = x - radius;
            const dy = y - radius;
            if (dx * dx + dy * dy > radiusSquare) {
                const index = (y * IMAGE_SIZE + x) * 4 + 3;
                if (!invalid && data[index] != 0) {
                    invalid = true;
                }
                data[index] = 0;
            }
        }
    }

    if (invalid) {
        alert("All non-transparent pixels must be within a circle with a radius of 256 pixels. Pixels outside are now made transparent.");
    }

    ctx.putImageData(imageData, 0, 0);
}

function evaluateHappyFeeling(ctx) {
    const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    const data = imageData.data;
    let brightPixels = 0;
    let warmPixels = 0;
    let nonTransparent = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];
        const brightness = 0.34 * r + 0.5 * g + 0.16 * b;
        if (brightness > 128) {
            brightPixels++;
        }
        if (r > b && g > b) {
            warmPixels++;
        }
        if (a > 0) {
            nonTransparent++;
        }
    }

    if (brightPixels < nonTransparent / 2 || warmPixels < nonTransparent / 2) {
        alert("The image might not convey a sufficient happy feeling.");
    }
}



document.getElementById('avatarCanvas').addEventListener('mouseenter', function() {
    drawBloom(true);
});

document.getElementById('avatarCanvas').addEventListener('mouseleave', function() {
    drawBloom(false);
});

function drawBloom(active) {
    const bloomCanvas = document.getElementById('bloomCanvas');
    const ctxBloom = bloomCanvas.getContext('2d');
    ctxBloom.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
    if (active && imgLoaded != null) {
        ctxBloom.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctxBloom.beginPath();
        ctxBloom.arc(256, 256, 256, 0, 2 * Math.PI);
        ctxBloom.fill();
    }
}