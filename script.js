document.addEventListener('DOMContentLoaded', (event) => {

/*----------------DOM-ELEMENTS---------------*/

const app = document.getElementById('app');
const sideBar = document.getElementById('sidebar');
const mainContainer = document.getElementById('main');
const saveButton = document.getElementById('create-bouquet');
const goBackButton = document.getElementById('go-back')
const saveForm = document.getElementById('save-bouquet-form');
const formContent = document.getElementById('form-content')
const flowerList = document.querySelector("#flower-list")
const popUp = document.getElementById('modal')
const viewAllButton = document.getElementById("view-all-bouquets")
const bouquetModal = document.getElementById('bouquetModal') 

let currentBouquet = [];
let sidebarOpen = false

// const sideBar = document.getElementById('sidebar');

//     const mainContainer = document.getElementById('main');
//     const flowerList = document.querySelector("#flower-list")
//     let FETCH_ALL_URL = "http://localhost:3000/"




/*----------------EVENT-LISTENERS------------*/


    saveButton.addEventListener("click", e => {
        popUp.style.display = "block";
        saveForm.onsubmit = (e) => {
            e.preventDefault();
            const name = saveForm.name.value;
            const description = saveForm.description.value
            const flowerIdStr = currentBouquet.toString();
            persistBouquet(name, description, flowerIdStr);
            const originalFormContentHTML = formContent.innerHTML

            formContent.innerHTML = "🌸 Bouquet Saved! 🌸"
            setTimeout(function(){ 
                popUp.style.display = "none";
                formContent.innerHTML = originalFormContentHTML;
                saveForm.reset(); 
            }, 2000);

        }
    })

    goBackButton.addEventListener("click", e => {
        e.preventDefault();
        popUp.style.display = "none";
    })

    bouquetModal.addEventListener("click", e => {
        e.preventDefault()
        
        if (e.target.dataset.action === "close") {
            bouquetModal.style.display = "none";
        }
    })

    viewAllButton.addEventListener('click', e => {
        e.preventDefault();
        renderAllBouquets(savedBouquets);
        document.getElementById('bouquetModal').style.display = "block";    
    })

/*----------------EVENT-HANDLERS-------------*/

    sideBar.addEventListener("mouseenter", () => {
        sidebarOpen = !sidebarOpen
        if (sidebarOpen) {
            app.classList.add("sidebar-open");
        }
    });

    sideBar.addEventListener("mouseleave", () => {
        sidebarOpen = !sidebarOpen
        if (!sidebarOpen) {
            app.classList.remove("sidebar-open");
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
                const selectedFlowers = document.querySelector("#selected-flowers")
                const bouquetItem = document.createElement("div")

                bouquetItem.className = "bouquet-item"
                bouquetItem.dataset.id = flower.id

                if (!currentBouquet.includes(bouquetItem.dataset.id)) {
                    currentBouquet.push(bouquetItem.dataset.id)
                    bouquetItem.innerHTML = `
                            <img class="bouquet-item-image" src="./images/${flower.img_url}.png" />`
                    selectedFlowers.append(bouquetItem)  

                    // Create Sounds and Sliders

                    const sound = createSound(flower, bouquetItem);
                    const slider = createVolumeSlider(flower, bouquetItem);
                    console.log(bouquetItem.img)
                    
                    bouquetItem.onclick = (e) => {
                        if (e.target.tagName === "IMG" && sound.dataset.action === "off") {
                            console.log("should be playing")
                            sound.play();
                            sound.dataset.action = "on";
                        } else if (e.target.tagName === "IMG" && sound.dataset.action === "on") {
                            console.log("should be pausing")
                            sound.pause();
                            sound.dataset.action = "off";
                        }

                        slider.oninput = () => {
                            const input = slider.value;
                            adjustVolume(sound, input)
                        }     
                    }  
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

    function renderOneBouquet(bouquet){
        const bouquetList = document.querySelector("#bouquet-list")
        const name = bouquet.name;
        const description = bouquet.description;
        
        bouquetLi = document.createElement('li')
        
        bouquetLi.innerText = `${name}`
        
        bouquetList.append(bouquetLi)
        
        bouquetLi.addEventListener("click", (e) => {

            const foundBouquet = savedBouquets.find(savedBouquet => savedBouquet.id === bouquet.id);
            currentBouquet = foundBouquet;
            loadSavedBouquet();
        })
    }

    function renderAllBouquets(bouquetData){
        bouquetData.forEach(renderOneBouquet)
    }
    
/*----------------RENDERERS------------------*/

function createSound (flower, bouquetItem) {
    const sound = document.createElement('audio');
    
    sound.id = flower.name;
    sound.src = `./sounds/${flower.sound}.mp3`;
    sound.preload = "none";
    sound.dataset.action = "on";
    bouquetItem.append(sound);
    const playPromise = sound.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
          
          sound.pause();
        })
        .catch(error => {
        
        });
      }
    
    return sound;
}

function createVolumeSlider (flower, bouquetItem) {
    const sliderOuterDiv = document.createElement("div");
    const slider = document.createElement("input");

    sliderOuterDiv.className = "slider-container";

    slider.id = flower.name;
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";

    sliderOuterDiv.append(slider)
    bouquetItem.append(sliderOuterDiv);
    return slider;
}

function adjustVolume (sound, input) {
    input = parseFloat(input * 0.01).toFixed(2);
    sound.volume = input;
}

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

function pushSavedBouquets(savedBouquetData) {
    savedBouquets = [];
    savedBouquetData.forEach((bouquet) => {
        savedBouquets.push(bouquet);
    })
}

function loadSavedBouquet () {
    bouquetModal.style.display = "none";

    currentBouquet.flowers.forEach((flower) => {
        console.log(flower)
        
        const selectedFlowers = document.querySelector("#selected-flowers")
        const bouquetItem = document.createElement("div")

        bouquetItem.className = "bouquet-item"
        bouquetItem.dataset.id = flower.id

        bouquetItem.innerHTML = `
                <img class="bouquet-item-image" src="./images/${flower.img_url}.png" />`
        selectedFlowers.append(bouquetItem)  

        const sound = createSound(flower, bouquetItem);
        const slider = createVolumeSlider(flower, bouquetItem);
        
        bouquetItem.onclick = (e) => {
            if (e.target.tagName === "IMG" && sound.dataset.action === "off") {
                console.log("should be playing")
                sound.play();
                sound.dataset.action = "on";
            } else if (e.target.tagName === "IMG" && sound.dataset.action === "on") {
                console.log("should be pausing")
                sound.pause();
                sound.dataset.action = "off";
            }

            slider.oninput = () => {
                const input = slider.value;
                adjustVolume(sound, input)
            }     
        } 
    })

}

/*----------------INITIAL-RENDER-----------------*/

function init() {

    fetch("http://localhost:3000/flowers")
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data)
        })

    fetch("http://localhost:3000/bouquets")
        .then(r => r.json())
        .then(data => {
            pushSavedBouquets(data)
        })
 }

 init();

}); // end of DOM Content Loaded


