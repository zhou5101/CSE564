var prevTabIdx = 0
function openTask(evt, idx) {
    const navbar = document.getElementsByClassName("navbar");
    const content = document.getElementsByClassName("tab");
    navbar[prevTabIdx].classList.toggle("active-btn")
    content[prevTabIdx].classList.toggle("active-tab")
    navbar[idx - 1].classList.toggle("active-btn")
    content[idx - 1].classList.toggle("active-tab")
    console.log(evt.target);
    prevTabIdx = idx - 1
}
const SCRIPT_ROOT = 'http://127.0.0.1:5000/'