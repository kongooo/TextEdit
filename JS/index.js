let arrows = document.querySelectorAll(".packup");
for (let i = 0; i < arrows.length; i++) {
    arrows[i].style.left = screen.width - 66 + "px";
}

let global_wrapper, global_tool_wrapper;

let tool = document.getElementsByClassName("tool")[0];
let theTop = document.querySelector(".top");
let top_height = theTop.clientHeight;


window.addEventListener('scroll', function() {
    let textTop = document.getElementById("textArea").getBoundingClientRect().top;
    if (textTop <= top_height) {
        if (!tool.classList.contains("toolBefore")) {
            tool.classList.add("toolBefore");
        }
    } else if (textTop > top_height) {
        tool.classList.remove("toolBefore");
    }
});


let tips = document.querySelectorAll(".rect");
for (let i = 0; i < tips.length; i++) {
    tips[i].style.left = -(tips[i].clientWidth / 2 - 11) + "px";
}

// let wrapper_tool_tips = document.querySelectorAll(".wrapper-tool-tip");
// let wrapper_tool_arrows = document.querySelectorAll(".wrapper-tool-tip");
// for (let i = 0; i < wrapper_tool_tips.length; i++) {
//     wrapper_tool_tips[i].querySelector(".rect").style.left = 0 + "px";
//     wrapper_tool_arrows[i].querySelector(".arrow-up").style.left = wrapper_tool_tips[i].clientWidth / 2 - 9 + "px";
// }

let tools = document.querySelectorAll(".tool-common");
for (let i = 0; i < tools.length; i++) {
    let arrow = tools[i].querySelector(".arrow-up");
    let text = tools[i].querySelector(".text");
    let svg = tools[i].querySelector("svg");
    if (text != null)
        arrow.style.left = text.clientWidth / 2 + "px";
    else if (svg != null)
        arrow.style.left = svg.clientWidth / 2 + "px";
}

let mutex = true;

function add(currentwrapper, toolWrapper) {
    currentwrapper.style.display = "flex";
    toolWrapper.querySelector(".text").classList.add("text-change");
    toolWrapper.querySelector(".arrow-down").classList.add("arrow-change");
    window.setTimeout(function() {
        currentwrapper.style.opacity = 1;
        currentwrapper.style.transform = "translateY(10px)";
        global_wrapper = currentwrapper;
        global_tool_wrapper = toolWrapper;
    }, 100);
}

function remove() {
    global_wrapper.style.opacity = 0;
    global_tool_wrapper.querySelector(".text").classList.remove("text-change");
    global_tool_wrapper.querySelector(".arrow-down").classList.remove("arrow-change");
    global_wrapper.style.transform = "translateY(-10px)";
    window.setTimeout(function() {
        global_wrapper.style.display = "none";
    }, 100);
}

let tool_wrapper_commons = document.querySelectorAll(".tool-wrapper-common");
for (let i = 0; i < tool_wrapper_commons.length; i++) {
    tool_wrapper_commons[i].addEventListener('click', event => {
        let wrapper = tool_wrapper_commons[i].parentNode.querySelector(".wrapper");
        if (global_wrapper != null && global_wrapper.style.opacity == 1) {
            remove();
            if (wrapper == global_wrapper) return;
        }
        add(wrapper, tool_wrapper_commons[i]);
        if (mutex)
            event.stopPropagation();
        mutex = false;
    })
}

let tool_text_commons = document.querySelectorAll(".tool-text-common");
for (let i = 0; i < tool_text_commons.length; i++) {
    tool_text_commons[i].addEventListener('click', event => {
        if (tool_text_commons[i].classList.contains("tool-text-change"))
            tool_text_commons[i].classList.remove("tool-text-change");
        else
            tool_text_commons[i].classList.add("tool-text-change");
        event.stopPropagation();
    })
}

window.addEventListener('click', event => {
    if (global_wrapper != null && global_wrapper.style.opacity == 1)
        remove();
})

document.querySelector(".palette-gradient").addEventListener('click', event => { event.stopPropagation(); })

let slider = document.querySelectorAll(".slider");
let move = new Array(false, false);
let circle_move = false;
let choose = document.querySelectorAll(".choose");
let gradient_panel = document.querySelector(".palette-gradient-panel");
let circle = document.querySelector(".circle");
let circleX = 0,
    circleY = 0;
let result = new color(255, 255, 255);
let R = document.querySelector(".r-value"),
    G = document.querySelector(".g-value"),
    B = document.querySelector(".b-value"),
    A = document.querySelector(".a-value"),
    H = document.querySelector(".hex-value");
let palette_result = document.querySelector(".palette-choose-result");
let a_choose = document.querySelector(".a-choose");

for (let i = 0; i < slider.length; i++) {
    slider[i].addEventListener('mousedown', event => {
        move[i] = true;
    })
    slider[i].addEventListener('mouseup', event => {
        move[i] = false;
    })
    choose[i].addEventListener('mousedown', event => {
        let x = event.clientX - 1065;
        slider[i].style.left = x + "px";
        changePalette(x);
        move[i] = true;
    })
}

gradient_panel.addEventListener('mousedown', event => {
    circle_move = true;
    changePos(event);
    changeRGB();
})

gradient_panel.addEventListener('mouseup', event => {
    circle_move = false;
})

function color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function linerColor(stt, end, percent) {
    r = end.r * percent + stt.r * (1 - percent);
    g = end.g * percent + stt.g * (1 - percent);
    b = end.b * percent + stt.b * (1 - percent);
    return new color(r, g, b);
}

document.addEventListener('mousemove', event => {
    for (let i = 0; i < slider.length; i++)
        if (move[i]) {
            let x = event.clientX - 1053;
            x = x < 0 ? 0 : x;
            x = x > 210 ? 210 : x;
            if (i == 0) {
                changePalette(x);
                changeRGB();
                change_a_choose();
            }
            if (i == 1) {
                changeA(x);
            }
            slider[i].style.left = x > 205 ? (205 + "px") : (x + "px");
        }
    if (circle_move) {
        changePos(event);
        changeRGB();
        change_a_choose();
    }
})

function changeA(x) {
    x = x / 210;
    ChangeResult(x);
    A.innerHTML = parseInt(x * 100);
}

function changeRGB() {
    let x = parseFloat(circleX) / 256,
        y = parseFloat(circleY) / 150;
    let hor_color = linerColor(new color(255, 255, 255), result, x);
    let current_color = linerColor(hor_color, new color(0, 0, 0), y);
    let newColor = new color(parseInt(current_color.r), parseInt(current_color.g), parseInt(current_color.b));
    R.innerHTML = newColor.r;
    G.innerHTML = newColor.g;
    B.innerHTML = newColor.b;
    H.innerHTML = rgbToHex(newColor);
    let a = parseFloat(A.innerHTML / 100);
    ChangeResult(a);
}

function change_a_choose() {
    a_choose.style.background = "linear-gradient(to right, rgba(0, 0, 0, 0),rgb(" + R.innerHTML + "," + G.innerHTML + "," + B.innerHTML + ")";
}

function componentToHex(x) {
    let hex = x.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function changePos(ev) {
    let x = event.clientX - 1053,
        y = event.clientY - 341;
    x = x < 0 ? 0 : x;
    x = x > 256 ? 256 : x;
    y = y < 0 ? 0 : y;
    y = y > 150 ? 150 : y;
    circleX = x;
    circleY = y;
    circle.style.left = x > 249 ? 249 + "px" : x + "px";
    circle.style.top = y > 144 ? 144 + "px" : y + "px";
}


function changePalette(x) {
    if (x >= 0 && x < 30)
        result = linerColor(new color(255, 0, 0), new color(255, 165, 0), x / 30);
    else if (x >= 30 && x < 60)
        result = linerColor(new color(255, 165, 0), new color(255, 255, 0), (x - 30) / 30);
    else if (x >= 60 && x < 90)
        result = linerColor(new color(255, 255, 0), new color(0, 128, 0), (x - 60) / 30);
    else if (x >= 90 && x < 120)
        result = linerColor(new color(0, 128, 0), new color(0, 0, 255), (x - 90) / 30);
    else if (x >= 120 && x < 150)
        result = linerColor(new color(0, 0, 255), new color(75, 0, 130), (x - 120) / 30);
    else if (x >= 150 && x < 180)
        result = linerColor(new color(75, 0, 130), new color(238, 130, 238), (x - 150) / 30);
    else if (x >= 180 && x <= 210)
        result = linerColor(new color(238, 130, 238), new color(255, 0, 0), (x - 180) / 30);
    gradient_panel.style.background = "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1)), linear-gradient(to right, rgba(255, 255, 255, 1), rgba(" + result.r + "," + result.g + "," + result.b + ",1))";
}


document.addEventListener('mouseup', event => {
    for (let i = 0; i < slider.length; i++)
        if (move[i]) {
            move[i] = false;
        }
    if (circle_move) circle_move = false;
})

let emptyGrids = document.querySelectorAll(".empty-grid");
let colorGrids = document.querySelectorAll(".color-grid");
for (let i = 0; i < colorGrids.length; i++) {
    colorGrids[i].addEventListener('click', event => {
        SetLineColor(colorGrids[i].style.backgroundColor);
        for (let j = emptyGrids.length - 1; j > 0; j--) {
            let parent = emptyGrids[j].parentNode;
            console.log(parent);
            emptyGrids[j].style.backgroundColor = emptyGrids[j - 1].style.backgroundColor;
            parent.style.backgroundColor = emptyGrids[j - 1].style.backgroundColor;
            if (emptyGrids[j].style.backgroundColor != "transparent") {
                if (parent.classList.contains("empty-grid-bigger")) {
                    parent.classList.remove("empty-grid-bigger");
                    emptyGrids[j].style.border = "none";
                }
            }
        }
        emptyGrids[0].style.backgroundColor = colorGrids[i].style.backgroundColor;
        emptyGrids[0].parentNode.style.backgroundColor = colorGrids[i].style.backgroundColor;
        if (emptyGrids[0].parentNode.classList.contains("empty-grid-bigger")) {
            emptyGrids[0].parentNode.classList.remove("empty-grid-bigger");
            emptyGrids[0].style.border = "none";
        }
    })
}

function SetLineColor(backgroundColor) {
    document.querySelector(".line-color").style.backgroundColor = backgroundColor;
}

function ChangeResult(a) {
    palette_result.style.backgroundColor = "rgba(" + R.innerHTML + "," + G.innerHTML + "," + B.innerHTML + "," + a + ")";
    SetLineColor(palette_result.style.backgroundColor);
}

let toolTexts = document.querySelectorAll("span.tool-wrapper-common");
for (let i = 0; i < toolTexts.length; i++) {
    let toolLists = toolTexts[i].parentNode.querySelectorAll(".list-item");
    for (let j = 0; j < toolLists.length; j++) {
        toolLists[j].addEventListener('click', event => {
            toolTexts[i].firstElementChild.innerHTML = toolLists[j].firstElementChild.innerHTML;
        })
    }
}

let align = document.querySelector("#alignment");
let alignChilds = document.querySelectorAll(".align");
for (let i = 0; i < alignChilds.length; i++) {
    alignChilds[i].addEventListener('click', event => {
        let newNode = alignChilds[i].firstElementChild.firstElementChild.cloneNode(true);
        align.removeChild(align.firstElementChild);
        align.appendChild(newNode);
    })
}

let push = document.querySelector(".push"),
    pull = document.querySelector(".pull");
let container = document.querySelector(".container"),
    tops = document.querySelector(".top");

push.addEventListener('click', event => {
    top_height = tool.clientHeight;
    pull.style.visibility = "visible";
    push.style.visibility = "hidden";
    if (!container.classList.contains("container-up"))
        container.classList.add("container-up");
    if (!tops.classList.contains("top-up"))
        tops.classList.add("top-up");
})

pull.addEventListener('click', event => {
    top_height = theTop.clientHeight;
    pull.style.visibility = "hidden";
    push.style.visibility = "visible";

    if (container.classList.contains("container-up"))
        container.classList.remove("container-up");
    if (tops.classList.contains("top-up"))
        tops.classList.remove("top-up");
})