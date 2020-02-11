document.addEventListener('DOMContentLoaded', (event) => {
    
    /*----------------DOM-ELEMENTS---------------*/
    
    const sideBar = document.getElementById('sidebar');
    const sideBarButton = document.getElementById('open-sidebar');
    const mainContainer = document.getElementById('main');
    const flowerList = document.querySelector("#flower-list")
    const FETCH_ALL_URL = "http://localhost:3000/flowers"
    
    
    /*----------------EVENT-LISTENERS------------*/
    
    fetch(FETCH_ALL_URL)
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data)
        })
    
/*----------------EVENT-HANDLERS-------------*/

sideBarButton.onclick = () => {
    sideBar.style.width = "250px";
    mainContainer.style.marginLeft = "250px";
    console.log("click'd")
}

/*----------------RENDERERS------------------*/

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



});


// exp 
flowerObj = {}
function saveBoquets(flowersObj) {
    data={
        flower: flowersObj
    };
    config={

    };

    fetch()
    
}