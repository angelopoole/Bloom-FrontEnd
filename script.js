document.addEventListener('DOMContentLoaded', (event) => {
    
/*----------------DOM-ELEMENTS---------------*/

const sideBar = document.getElementById('sidebar');
const sideBarButton = document.getElementById('open-sidebar');
const mainContainer = document.getElementById('main');

console.log(sideBar)

/*----------------EVENT-LISTENERS------------*/


/*----------------EVENT-HANDLERS-------------*/

sideBarButton.onclick = () => {
    sideBar.style.width = "250px";
    mainContainer.style.marginLeft = "250px";
    console.log("click'd")
}

/*----------------RENDERERS------------------*/


});