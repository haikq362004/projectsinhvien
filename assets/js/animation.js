window.onload = function () {
    document.getElementById("myVideo").play();
};

const container = document.querySelector(".menu-container");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let currentIndex = 0;
const totalItems = document.querySelectorAll(".event-item").length;
const visibleItems = 4;


function updateSlider() {
    const offset = -currentIndex * (250 + 20);
    container.style.transform = `translateX(${offset}px)`;
}


next.addEventListener("click", () => {
    if (currentIndex < totalItems - visibleItems) {
        currentIndex++;
        updateSlider();
    }
});


prev.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

updateSlider();

