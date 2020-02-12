document.addEventListener('DOMContentLoaded', (event) => {
  
    let bouquetArray = []
/*----------------DOM-ELEMENTS---------------*/

const sideBar = document.getElementById('sidebar');
const sideBarButton = document.getElementById('open-sidebar');
const mainContainer = document.getElementById('main');



/*----------------EVENT-LISTENERS------------*/

// addButton.addEventListener("click", () => {
//     console.log('clicked me')
// })

// closeButton.addEventListener("click", () => {
//     console.log ('clicked me too')
//     // let flowerMain = document.querySelector("#flower-main")
//     // flowerMain.style.display = "none"
// })

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
    const flowerList = document.querySelector("#flower-list")

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
            flowerMain.style.display = "flex"

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

            addButton.addEventListener("click", () => {
                const bouquetList = document.querySelector("#bouquet-list")
                const bouquetItem = document.createElement("span")
                bouquetItem.className = "bouquet-item"
                bouquetItem.dataset.id = flower.id

                if (!bouquetArray.includes(bouquetItem.dataset.id)) {
                    bouquetArray.push(bouquetItem.dataset.id)
                    console.log(bouquetArray)
                    bouquetItem.innerHTML = `
                            <div class="bouquet-item-image" style="background-image: url(${flower.img_url})"></div>`
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
    


    fetch("http://localhost:3000/flowers")
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data)
        })


});