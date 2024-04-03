// ==UserScript==
// @name         Visualizer
// @description  Keys display for streaming
// @author       N3onTechF0X
// @version      1.0.4
// @match        https://*.tankionline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @run-at       document-start
// ==/UserScript==

const styleElement = document.createElement("style");
document.head.appendChild(styleElement);
styleElement.textContent = `
.visualizer_window{
    display: block;
    position: fixed;
    width: 15rem;
    top: 5rem;
    left: 5rem;
    padding: 1rem;
    background: rgba(50,50,50,0.5);
    backdrop-filter: blur(3px);
    border-radius: 1.5rem;
    z-index: 9999;
    font-size: 1.5rem;
    color: white;
    user-select: none;
}
.visualizer_title{
    text-align: center;
}

.visualizer_row{
    display: flex;
    justify-content: center;
}
.visualizer_arrow{
    width: 3.5rem;
    height: 3.5rem;
    background: rgba(20,20,20,0.5);
    border-radius: 1rem;
    margin: 0.3rem;
    text-align: center;
    line-height: 3.5rem;
    transition: background 0.5s ease;
}
.visualizer_space{
    display: block;
    width: 85%;
    height: 2rem;
    background: rgba(20,20,20,0.5);
    border-radius: 1rem;
    margin: 0.5rem auto;
    text-align: center;
    transition: background 0.5s ease;
}
.visualizer_supplie{
    width: 2.3rem;
    height: 2.3rem;
    background: rgba(20,20,20,0.5);
    border-radius: 1rem;
    margin: 0.25rem;
    text-align: center;
    line-height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.visualizer_supplie > img{
    width: 1.5rem;
    height: 1.5rem;
    filter: contrast(0%);
    transition: filter 0.5s ease;
}
`;

const floatingWindow = document.createElement("div");
floatingWindow.classList.add("visualizer_window");

const title = document.createElement("div");
title.classList.add("visualizer_title");
title.textContent = "Visualizer";
floatingWindow.appendChild(title);

const arrowsContainer1 = document.createElement("div");
arrowsContainer1.classList.add("visualizer_row");
const arrowsContainer2 = document.createElement("div");
arrowsContainer2.classList.add("visualizer_row");

const arrowUp = document.createElement("div");
arrowUp.classList.add("visualizer_arrow");
arrowUp.textContent = "↑";
const arrowLeft = document.createElement("div");
arrowLeft.classList.add("visualizer_arrow");
arrowLeft.textContent = "←";
const arrowDown = document.createElement("div");
arrowDown.classList.add("visualizer_arrow");
arrowDown.textContent = "↓";
const arrowRight = document.createElement("div");
arrowRight.classList.add("visualizer_arrow");
arrowRight.textContent = "→";

arrowsContainer1.appendChild(arrowUp);
floatingWindow.appendChild(arrowsContainer1);

arrowsContainer2.appendChild(arrowLeft);
arrowsContainer2.appendChild(arrowDown);
arrowsContainer2.appendChild(arrowRight);
floatingWindow.appendChild(arrowsContainer2);

const spaceDiv = document.createElement("div");
spaceDiv.classList.add("visualizer_space");
spaceDiv.textContent = "Shoot";
floatingWindow.appendChild(spaceDiv);

const suppliesContainer = document.createElement("div");
suppliesContainer.classList.add("visualizer_row");

const images = {
    repair: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMyAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNS40OTk1IDEuNUwyMC45OTk1IDZWOEwyNC45OTk1IDEySDI2Ljk5OTVMMzEuNDk5NSA3LjVIMzIuOTk5NVYxMEMzMi45OTk1IDE1LjUyMjggMjguNTIyNCAyMCAyMi45OTk1IDIwQzIxLjUzMjIgMjAgMjAuMTM4NiAxOS42ODQgMTguODgzMyAxOS4xMTYyTDYuOTk5OTMgMzAuOTk5OUM1LjYxOTIyIDMyLjM4MDcgMy4zODA2MSAzMi4zODA3IDEuOTk5ODkgMzFDMC42MTkxOSAyOS42MTkzIDAuNjE5MTc3IDI3LjM4MDcgMS45OTk4NSAyNkwxMy44ODMzIDE0LjExNjJDMTMuMzE1NiAxMi44NjA5IDEyLjk5OTUgMTEuNDY3MyAxMi45OTk1IDEwQzEyLjk5OTUgNC40NzcxNSAxNy40NzY3IDAgMjIuOTk5NSAwSDI1LjQ5OTVWMS41WiIgZmlsbD0iI0JGRTUwMCIvPgo8L3N2Zz4K",
    shield: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOS4zNTg1IDIwLjI2MTdDMjYuNjE0MSAyOC45Njc0IDE2IDMyIDE2IDMyQzE2IDMyIDIgMjggMiAxNlY1LjUwODZDMiA0LjYxNTY0IDIuNTkxOTUgMy44MzA4NyAzLjQ1MDU2IDMuNTg1NTVMMTYgMEwyOC41NDk0IDMuNTg1NTVDMjkuNDA4IDMuODMwODcgMzAgNC42MTU2NCAzMCA1LjUwODZWMTJWMTZDMzAgMTYgMzAgMTYgMzAgMTZDMzAgMTcuNTUxNCAyOS43NjYgMTguOTY5MSAyOS4zNTg1IDIwLjI2MTdaTTI2IDEwLjg1NzFWNy4wMTcyMUwxNiA0LjE2MDA2TDYgNy4wMTcyMVYxNkM2IDIwLjIwOTEgOC4zOTA3NCAyMy4xNDkyIDExLjMyNSAyNS4yNDUxQzEyLjc3OTMgMjYuMjgzOSAxNC4yNTk1IDI3LjAyNzIgMTUuMzg4MiAyNy41MTA5QzE1LjYwOSAyNy42MDU1IDE1LjgxNCAyNy42ODkyIDE2IDI3Ljc2MjRMMTYgOEwyNiAxMC44NTcxWiIgZmlsbD0iI0VBREM5OSIvPgo8L3N2Zz4K",
    damage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00IDEuMzMzMzNMMCAyNkwyMCAxMkw2IDMyTDMwLjY2NjcgMjhMMjAgMjRMMzIgMEw4IDEyTDQgMS4zMzMzM1oiIGZpbGw9IiNGRjMzMzMiLz4KPC9zdmc+Cg==",
    speed: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgMTMuODM5N0MyIDEyLjY3MiAyLjUxMDI1IDExLjU2MjYgMy4zOTY4MyAxMC44MDI3TDE2IDBMMjguNjAzMiAxMC44MDI3QzI5LjQ4OTcgMTEuNTYyNiAzMCAxMi42NzIgMzAgMTMuODM5N1YyMEwxNiA4TDIgMjBWMTMuODM5N1oiIGZpbGw9IiNGRkZGMDAiLz4KPHBhdGggZD0iTTIgMjUuODM5N0MyIDI0LjY3MiAyLjUxMDI1IDIzLjU2MjYgMy4zOTY4MyAyMi44MDI3TDE2IDEyTDI4LjYwMzIgMjIuODAyN0MyOS40ODk3IDIzLjU2MjYgMzAgMjQuNjcyIDMwIDI1LjgzOTdWMzJMMTYgMjBMMiAzMlYyNS44Mzk3WiIgZmlsbD0iI0ZGRkYwMCIvPgo8L3N2Zz4K",
    mine: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00IDIxLjAwOThWMTAuOTkwMkwxMC45OTAyIDRIMjEuMDA5OEwyOCAxMC45OTAyVjIxLjAwOThMMjEuMDA5OCAyOEgxMC45OTAyTDQgMjEuMDA5OFpNOC43NDc1NSAwLjU4NTc4NkM5LjEyMjYyIDAuMjEwNzEzIDkuNjMxMzMgMCAxMC4xNjE4IDBIMjEuODM4MkMyMi4zNjg3IDAgMjIuODc3NCAwLjIxMDcxNCAyMy4yNTI1IDAuNTg1Nzg3TDMxLjQxNDIgOC43NDc1NUMzMS43ODkzIDkuMTIyNjIgMzIgOS42MzEzMyAzMiAxMC4xNjE4VjIxLjgzODJDMzIgMjIuMzY4NyAzMS43ODkzIDIyLjg3NzQgMzEuNDE0MiAyMy4yNTI1TDIzLjI1MjUgMzEuNDE0MkMyMi44Nzc0IDMxLjc4OTMgMjIuMzY4NyAzMiAyMS44MzgyIDMySDEwLjE2MThDOS42MzEzMyAzMiA5LjEyMjYyIDMxLjc4OTMgOC43NDc1NSAzMS40MTQyTDAuNTg1Nzg2IDIzLjI1MjVDMC4yMTA3MTMgMjIuODc3NCAwIDIyLjM2ODcgMCAyMS44MzgyVjEwLjE2MThDMCA5LjYzMTMzIDAuMjEwNzE0IDkuMTIyNjIgMC41ODU3ODYgOC43NDc1NUw4Ljc0NzU1IDAuNTg1Nzg2Wk0xNiAyM0MxOS44NjYgMjMgMjMgMTkuODY2IDIzIDE2QzIzIDEyLjEzNCAxOS44NjYgOSAxNiA5QzEyLjEzNCA5IDkgMTIuMTM0IDkgMTZDOSAxOS44NjYgMTIuMTM0IDIzIDE2IDIzWiIgZmlsbD0iIzM2QjI0QSIvPgo8L3N2Zz4K",
};

const repair = document.createElement("div");
repair.classList.add("visualizer_supplie");
const repairImg = document.createElement("img");
repairImg.src = images.repair;

const shield = document.createElement("div");
shield.classList.add("visualizer_supplie");
const shieldImg = document.createElement("img");
shieldImg.src = images.shield;

const damage = document.createElement("div");
damage.classList.add("visualizer_supplie");
const damageImg = document.createElement("img");
damageImg.src = images.damage;

const speed = document.createElement("div");
speed.classList.add("visualizer_supplie");
const speedImg = document.createElement("img");
speedImg.src = images.speed;

const mine = document.createElement("div");
mine.classList.add("visualizer_supplie");
const mineImg = document.createElement("img");
mineImg.src = images.mine;

repair.appendChild(repairImg);
shield.appendChild(shieldImg);
damage.appendChild(damageImg);
speed.appendChild(speedImg);
mine.appendChild(mineImg);

suppliesContainer.appendChild(repair);
suppliesContainer.appendChild(shield);
suppliesContainer.appendChild(damage);
suppliesContainer.appendChild(speed);
suppliesContainer.appendChild(mine);

floatingWindow.appendChild(suppliesContainer);

const isChatOpen = () => !!document.querySelector(`input[type="text"], input[type="email"], input[type="password"], textarea`)

document.addEventListener("keydown", ({code}) => {
    if (isChatOpen()) return;
    switch(code) {
        case "Space":
            spaceDiv.style.background = "rgba(200,50,50,0.5)";
            break;
        case "KeyW":
        case "ArrowUp":
            arrowUp.style.background = "rgba(150,150,150,0.5)";
            break;
        case "KeyA":
        case "ArrowLeft":
            arrowLeft.style.background = "rgba(150,150,150,0.5)";
            break;
        case "KeyS":
        case "ArrowDown":
            arrowDown.style.background = "rgba(150,150,150,0.5)";
            break;
        case "KeyD":
        case "ArrowRight":
            arrowRight.style.background = "rgba(150,150,150,0.5)";
            break;
        case "Digit1":
            repairImg.style.filter = "contrast(100%)";
            break;
        case "Digit2":
            shieldImg.style.filter = "contrast(100%)";
            break;
        case "Digit3":
            damageImg.style.filter = "contrast(100%)";
            break;
        case "Digit4":
            speedImg.style.filter = "contrast(100%)";
            break;
        case "Digit5":
            mineImg.style.filter = "contrast(100%)";
            break;
    }
});

document.addEventListener("keyup", ({code}) => {
    switch(code) {
        case "Space":
            spaceDiv.style.background = "rgba(20,20,20,0.5)";
            break;
        case "KeyW":
        case "ArrowUp":
            arrowUp.style.background = "rgba(20,20,20,0.5)";
            break;
        case "KeyA":
        case "ArrowLeft":
            arrowLeft.style.background = "rgba(20,20,20,0.5)";
            break;
        case "KeyS":
        case "ArrowDown":
            arrowDown.style.background = "rgba(20,20,20,0.5)";
            break;
        case "KeyD":
        case "ArrowRight":
            arrowRight.style.background = "rgba(20,20,20,0.5)";
            break;
        case "Digit1":
            repairImg.style.filter = "contrast(0%)";
            break;
        case "Digit2":
            shieldImg.style.filter = "contrast(0%)";
            break;
        case "Digit3":
            damageImg.style.filter = "contrast(0%)";
            break;
        case "Digit4":
            speedImg.style.filter = "contrast(0%)";
            break;
        case "Digit5":
            mineImg.style.filter = "contrast(0%)";
            break;
    }
});

document.addEventListener("mousedown", ({button}) => {
    if (isChatOpen()) return;
    if (button === 0) {
        spaceDiv.style.background = "rgba(200,50,50,0.5)";
    }
});

document.addEventListener("mouseup", ({button}) => {
    isDragging = false;
    if (button === 0) {
        spaceDiv.style.background = "rgba(20,20,20,0.5)";
    }
});

let offsetX, offsetY, isDragging = false;
floatingWindow.addEventListener("mousedown", ({clientX, clientY}) => {
    isDragging = true;
    offsetX = clientX - floatingWindow.getBoundingClientRect().left;
    offsetY = clientY - floatingWindow.getBoundingClientRect().top;
});
document.addEventListener("mousemove", ({clientX, clientY}) => {
    if (isDragging) {
        floatingWindow.style.left = `${clientX - offsetX}px`;
        floatingWindow.style.top = `${clientY - offsetY}px`;
    }
});

document.body.appendChild(floatingWindow);
