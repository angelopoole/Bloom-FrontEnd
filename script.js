document.addEventListener('DOMContentLoaded', (event) => {
    
    /*----------------DOM-ELEMENTS---------------*/
    
    const sideBar = document.getElementById('sidebar');
    const sideBarButton = document.getElementById('open-sidebar');
    const mainContainer = document.getElementById('main');
    const flowerList = document.querySelector("#flower-list")
    let FETCH_ALL_URL = "http://localhost:3000/"
    
    
    /*----------------EVENT-LISTENERS------------*/
    
    fetch(FETCH_ALL_URL + 'flowers')
    .then(r => r.json())
    .then(data => {
        renderAllFlowers(data)
    })
    
    /*----------------EVENT-HANDLERS-------------*/
    let sidebarOpen = false
    
    sideBarButton.addEventListener("click", () => {
        sidebarOpen = !sidebarOpen
        if (sidebarOpen) {
            sideBarButton.innerText = "Close Sidebar"
            sideBar.style.width = "200px";
            mainContainer.style.marginLeft = "200px";
        } else {
            sideBarButton.innerText = "Open Sidebar"
            sideBar.style.width = "0px";
            mainContainer.style.marginLeft = "0px";
        }   
    })
    
    /*----------------RENDERERS------------------*/
    
    function renderOneFlower(flower) {
        const flowerSpan = document.createElement('span')
        flowerSpan.className = "card"
        flowerSpan.dataset.id = flower.id
        
        flowerSpan.innerHTML = `
        <div class="side-image" style="background-image: url(${flower.img_url})">  
        </div>
        <div class="content">
        <div class="name">${flower.name}</div>
        </div> `
        flowerList.append(flowerSpan)
        
        flowerSpan.addEventListener("click", () => {
            let flowerMain = document.querySelector("#flower-main")
            flowerMain.innerHTML = `
            <div class="main-image" style="background-image: url(${flower.img_url})"> </div>
            <div class="content">
            <div class="name"><h2>${flower.name}</h2></div>
            <div class="meaning"><p>Meaning: ${flower.meaning}<p></div>
            <div class="sound"><p>Sound: ${flower.sound}</p></div>
            <button id="add-to-bouquet">Add to Bouquet</button>
            <button id="close">Close</button>
            </div> `
            
            const addButton = document.querySelector("#add-to-bouquet")
            const closeButton = document.querySelector("#close")
            
            addButton.addEventListener("click", () => saveBouquet())
            
            closeButton.addEventListener("click", () => {
                console.log('clicked me too')
            })
        })
    }
    
    
    
    function renderAllFlowers(flowers) {
        flowers.forEach(renderOneFlower)
    }
    
    
    
    
    
    
});

// exp 
// I need the flower and the bouque. then i need to create a FlowerBouquet with those two as soon as a bouquet is made 
// expiremental code 
// function buttonSaveHandler(e){
//     // event.preventDefault 
//     // fetch(FETCH_ALL_URL + ':id')
// }

function saveBouquet(e) {
    console.log("hello!");
    
    const flowerArray = ["hello"];
    const description = "test desc"
    const name = "test name"


    const data={
        name: name,
        description: description,
        flower: flowerArray
    };
    
    const config={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    
    fetch("http://localhost:3000/" + "bouquets", config)
    .then(res => res.json())
    .then(data => console.log(data))
    // here we make a post for the FlowerBouquet object to create the relationship
}

// function createFlowerBouquet(data){
    //     console.log("works!")
    // }