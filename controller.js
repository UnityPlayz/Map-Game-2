const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ảnh nền (hình thoi)
const background = new Image();
background.crossOrigin = "anonymous";  // Tránh lỗi CORS
background.src = "background.png"; 

// Ảnh nhân vật
const images = {
    default: "MyPic.png",
    left: "MyPic2.png",
    right: "MyPic3.png"
};
let currentImage = new Image();
currentImage.src = images.default;

// Kích thước nhân vật
const playerSize = 50;

// Vị trí & vận tốc
let x, y;
let vx = 0, vy = 0;
let ax = 0, ay = 0;
const acceleration = 1;
const friction = 0.5;
const maxSpeed = 2.5;

const keys = {}; // Lưu trạng thái phím
let isBackgroundLoaded = false; // Đảm bảo ảnh đã tải

// Khi ảnh nền tải xong, vẽ lên canvas
background.onload = function () {
    canvas.width = background.width;
    canvas.height = background.height;

    // Đặt nhân vật vào trung tâm hình thoi
    x = canvas.width / 2 - playerSize / 2;
    y = canvas.height / 2 - playerSize / 2;

    isBackgroundLoaded = true; // Ảnh nền đã tải
    update(); // Chạy game loop
};

// Hàm kiểm tra nhân vật có nằm trong hình thoi không
function isInsideDiamond(x, y) {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let halfWidth = canvas.width / 2 - 10;
    let halfHeight = canvas.height / 2 - 10;

    return Math.abs(x - centerX) / halfWidth + Math.abs(y - centerY) / halfHeight <= 1;
}

// Hàm cập nhật game loop
function update() {
    ax = 0;
    ay = 0;

    // Xử lý hướng đi
    if (keys["ArrowUp"] || keys["w"]) ay -= acceleration;
    if (keys["ArrowDown"] || keys["s"]) ay += acceleration;
    if (keys["ArrowLeft"] || keys["a"]) {
        ax -= acceleration;
        currentImage.src = images.left;
    }
    if (keys["ArrowRight"] || keys["d"]) {
        ax += acceleration;
        currentImage.src = images.right;
    }

    // Nếu không nhấn phím trái/phải, quay về ảnh mặc định
    if (!keys["ArrowLeft"] && !keys["a"] && !keys["ArrowRight"] && !keys["d"]) {
        currentImage.src = images.default;
    }

    // Cập nhật vận tốc (thêm ma sát)
    vx += ax;
    vy += ay;
    vx *= friction;
    vy *= friction;

    // Giới hạn tốc độ tối đa
    vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
    vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));

    // Cập nhật vị trí mới
    let newX = x + vx;
    let newY = y + vy;

    // Kiểm tra nếu nhân vật đi ra ngoài hình thoi, thì không cho di chuyển
    if (isInsideDiamond(newX, newY)) {
        x = newX;
        y = newY;
    } else {
        vx = 0; // Ngừng di chuyển khi chạm viền hình thoi
        vy = 0;
    }

    // Vẽ lại canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0); // Vẽ nền
    ctx.drawImage(currentImage, x, y, playerSize, playerSize); // Vẽ nhân vật

    // Tiếp tục game loop
    requestAnimationFrame(update);
}

// Lắng nghe sự kiện phím
window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});
