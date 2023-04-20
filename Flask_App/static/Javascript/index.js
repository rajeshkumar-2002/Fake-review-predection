window.onload = function () {
    document.getElementById('modal').style.display = "block";
}
const closeButton = document.getElementById("close-modal");
const modal = document.getElementById("modal");

closeButton.addEventListener("click", function () {

    modal.style.display = "none";
    window.location = "/";

});