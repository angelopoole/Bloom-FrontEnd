document.addEventListener('DOMContentLoaded', (event) => {
    
/*----------------DOM-ELEMENTS---------------*/

const sideBar = document.getElementById('sidebar');
const sideBarButton = document.getElementById('open-sidebar');
const mainContainer = document.getElementById('main');



/*----------------EVENT-LISTENERS------------*/


/*----------------EVENT-HANDLERS-------------*/

sideBarButton.onclick = () => {
    sideBar.style.width = "250px";
    mainContainer.style.marginLeft = "250px";
    console.log("click'd")
}

/*----------------RENDERERS------------------*/
const flowerList = document.querySelector("#flower-list")

    function renderOneFlower(flower) {
        const outerLi = document.createElement('li')
        outerLi.className = "card"
        outerLi.dataset.id = flower.id
    
        outerLi.innerHTML = `
        <div class="image">
            <img class="image" src="${flower.img_url}" alt="${flower.name}">
        </div>
        <div class="content">
            <div class="name">${flower.name}</div>
            <div class="meaning"><p>Meaning: ${flower.meaning}<p></div>
            <div class="sound"><p>Sound: ${flower.sound}</p></div>
        </div> `
        flowerList.append(outerLi)
    }

    function renderAllFlowers(flowers) {
        flowers.forEach(renderOneFlower)
    }

    fetch("http://localhost:3000/flowers")
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data)
        })


});