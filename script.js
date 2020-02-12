document.addEventListener('DOMContentLoaded', (event) => {

/*----------------DOM-ELEMENTS---------------*/

const sideBar = document.getElementById('sidebar');
const sideBarButton = document.getElementById('open-sidebar');
const mainContainer = document.getElementById('main');
const saveButton = document.getElementById('create-bouquet');
const saveForm = document.getElementById('save-bouquet-form');
const flowerList = document.querySelector("#flower-list")

let currentBouquet = [];
let sidebarOpen = false

// const sideBar = document.getElementById('sidebar');
//     const sideBarButton = document.getElementById('open-sidebar');
//     const mainContainer = document.getElementById('main');
//     const flowerList = document.querySelector("#flower-list")
//     let FETCH_ALL_URL = "http://localhost:3000/"




/*----------------EVENT-LISTENERS------------*/


    saveButton.addEventListener("click", e => {
        document.getElementById('modal').style.display = "block";
        saveForm.onsubmit = (e) => {
            e.preventDefault();
            const name = saveForm.name.value;
            const description = saveForm.description.value
            const flowerIdStr = currentBouquet.toString();
            persistBouquet(name, description, flowerIdStr);
        }
    })

/*----------------EVENT-HANDLERS-------------*/

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
            <img class="side-image" src="./images/${flower.img_url}.png" />
            <div class="content">
                <div class="name">${flower.name}</div>
            </div> `
        flowerList.append(flowerSpan)

        flowerSpan.addEventListener("click", () => {
            let flowerMain = document.querySelector("#flower-main")
            flowerMain.style.display = "flex"

            flowerMain.innerHTML = `
            <img class="main-image" src="./images/${flower.img_url}.png" />
                    <div class="content">
                        <div class="name"><h2>${flower.name}</h2></div>
                        <div class="meaning"><p>Meaning: ${flower.meaning}<p></div>
                        <div class="sound"><p>Sound: ${flower.sound}</p></div>
                        <button id="add-to-bouquet">Add to Bouquet</button>
                        <button id="close">Close</button>
                    </div> `

            const addButton = document.querySelector("#add-to-bouquet")
            const closeButton = document.querySelector("#close")

            addButton.addEventListener("click", () => {
                const bouquetList = document.querySelector("#bouquet-list")
                const bouquetItem = document.createElement("span")
                bouquetItem.className = "bouquet-item"
                bouquetItem.dataset.id = flower.id

                if (!currentBouquet.includes(bouquetItem.dataset.id)) {
                    currentBouquet.push(bouquetItem.dataset.id)
                    console.log(currentBouquet)
                    bouquetItem.innerHTML = `
                            <img class="bouquet-item-image" src="./images/${flower.img_url}.png" />`
                    bouquetList.append(bouquetItem)       
                }    
            })
            
            closeButton.addEventListener("click", () => {
                // let flowerMain = document.querySelector("#flower-main")
                flowerMain.style.display = "none"
            })    

        })    
    
    }
    
    
    function renderAllFlowers(flowers) {
        flowers.forEach(renderOneFlower)
    }
    
/*----------------RENDERERS------------------*/

function persistBouquet (name, description, flowerIdStr) {
    const data = {
        name: name,
        description: description,
        flowers: flowerIdStr
    };

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch("http://localhost:3000/bouquets", config)
        .then(r => r.json())
        .then(rData => console.log(rData));
    
}

    fetch("http://localhost:3000/flowers")
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data)
        })
    });
