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
let allSoundsById = {};
const audioContextById = {};
let sidebarOpen = false

const soundTranslations = {
    "birds": "🎶 🦜",
    "campfire": "🏕 🔥",
    "rain": "🌧 ☔️",
    "river": "💦 🏞",
    "thunder": "⛈ ⚡️",
    "wind-chime": "🎐 🎵",
    "windy-forest": "🌲 🍃"
}




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
        let sound;
        if (!allSoundsById[flower.name]) {
            sound = createSound(flower);
        } else {
            sound = allSoundsById[flower.name];
        }
       
        if (!flower.rendered) {
            const flowerSpan = document.createElement('span')
            flowerSpan.className = "card"
            flowerSpan.id = `${flower.name}-sidebar`
        
            
            flowerSpan.innerHTML = `
                <img class="side-image" src="./images/${flower.img_url}.png" />
                <div class="content">
                    <div class="name">${flower.name}</div>
                </div> `
            flowerList.append(flowerSpan)
            flower["rendered"] = true;
        }  

        const flowerSpan = document.getElementById(`${flower.name}-sidebar`)

        flowerSpan.addEventListener("click", () => {
            let flowerMain = document.querySelector("#flower-main")
            flowerMain.style.display = "flex"

            flowerMain.innerHTML = `
            <img class="main-image" src="./images/${flower.img_url}.png" />
                    <div class="main-content">
                        <div class="name"><h2>${flower.name}</h2></div>
                        <div class="meaning"><p><i>Meaning // </i> ${flower.meaning}<p></div>
                        <div class="sound"><p><i>Sound // </i> <font size="5"> ${soundTranslations[flower.sound]} </font> </p></div>
                        <button class="btn" id="add-to-bouquet">Add to Bouquet</button>
                        <button class="btn" id="close">Close</button>
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
                            <img class="bouquet-item-image" id="${flower.name}-img" src="./images/${flower.img_url}.png" />
                            <button class="remove-from-bouquet-btn" id="${flower.name}-remove">Ｘ</button>`
                    selectedFlowers.append(bouquetItem)  

                    // Create Sounds and Sliders
                    playSound(sound, flower.name);

                    const slider = createVolumeSlider(flower, bouquetItem);
                    slider.oninput = () => {
                        const input = slider.value;
                        adjustVolume(sound, input)
                    }

                    const removeButton = document.getElementById(`${flower.name}-remove`)
                    
                    bouquetItem.onmouseover = () => {
                        removeButton.style.display = "inline-block"
                    }
                    bouquetItem.onmouseleave = () => {
                        removeButton.style.display = "none"
                    }
                    removeButton.onclick = () => {
                        sound.pause();
                        sound.currentTime = 0;
                        currentBouquet.pop();
                        selectedFlowers.removeChild(bouquetItem);
                        renderOneFlower(flower);
                    }

                    bouquetItem.onclick = (e) => {
                        const flowerImg = document.getElementById(`${flower.name}-img`);
                        if (e.target.tagName === "IMG" && sound.dataset.action === "off") {
                            flowerImg.style.opacity="1";
                            sound.play();
                            sound.dataset.action = "on";
                        } else if (e.target.tagName === "IMG" && sound.dataset.action === "on") {
                            sound.pause();
                            flowerImg.style.opacity="0.5";
                            sound.dataset.action = "off";
                        }       
                    }
                    renderVisualizer();  
                } 
            })
            
            closeButton.addEventListener("click", () => {
                flowerMain.style.display = "none"
            })   

        })    
    
    }
    
    
    function renderAllFlowers(flowers) {
        flowers.forEach(renderOneFlower)
    }

    function renderOneBouquet(bouquet){
        const bouquetList = document.querySelector("#bouquet-list");
        const name = bouquet.name;
        const description = bouquet.description;
        
        bouquetLi = document.createElement("li")
        bouquetLi.className = "bouquet-list-item"
        
        bouquetLi.innerHTML = `
            <div><font size="4"><u>${name}</u></font><br>
            <i>${description}</i></div><br>`
        
        bouquetList.append(bouquetLi)

        bouquetLi.addEventListener("click", (e) => {

            const foundBouquet = savedBouquets.find(savedBouquet => savedBouquet.id === bouquet.id);
            loadSavedBouquet(foundBouquet);
        }) 
    }

    function renderAllBouquets(bouquetData){
        bouquetData.forEach(renderOneBouquet)
    }
    
/*----------------HELPERS------------------*/

function createSound (flower) {
    const sound = document.createElement('audio');
    
    sound.id = flower.name;
    sound.src = `./sounds/${flower.sound}.mp3`;
    sound.preload = "none";
    sound.crossOrigin = "anonymous";
    sound.loop = "true";
    sound.dataset.action = "off";
    document.getElementById("audio-container").append(sound);
    allSoundsById[sound.id] = sound;

    
    return sound;
}

function playSound (sound, id) {
    sound.dataset.action = "on"
    sound.play();
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
        .then(bouquetData => {
            savedBouquets.push(bouquetData);
            renderOneBouquet(bouquetData);
        });
    
}

function pushSavedBouquets(savedBouquetData) {
    savedBouquets = [];
    savedBouquetData.forEach((bouquet) => {
        savedBouquets.push(bouquet);
    })
}

function loadSavedBouquet (foundBouquet) {
    bouquetModal.style.display = "none";
    Object.values(allSoundsById).forEach((sound) => sound.pause())

    const selectedFlowers = document.querySelector("#selected-flowers");

    while (selectedFlowers.firstChild) {
        selectedFlowers.removeChild(selectedFlowers.firstChild);
    }
 
    currentBouquet = [...foundBouquet.flowers];
    
    foundBouquet.flowers.forEach((flower) => {
        const bouquetItem = document.createElement("div")
        const sound = allSoundsById[flower.name]


        bouquetItem.className = "bouquet-item"
        bouquetItem.dataset.id = flower.id

        bouquetItem.innerHTML = `
                <img class="bouquet-item-image" src="./images/${flower.img_url}.png" />
                <button class="remove-from-bouquet-btn" id="${flower.name}-remove">Ｘ</button>`
        selectedFlowers.append(bouquetItem)  

        playSound(sound, flower.name);
        const slider = createVolumeSlider(flower, bouquetItem);
        slider.oninput = () => {
            const input = slider.value;
            adjustVolume(sound, input)
        }   

        const removeButton = document.getElementById(`${flower.name}-remove`)
                    
        bouquetItem.onmouseover = () => {
            removeButton.style.display = "inline-block"
        }
        bouquetItem.onmouseleave = () => {
            removeButton.style.display = "none"
        }
        removeButton.onclick = () => {
            sound.pause();
            sound.currentTime = 0;
            currentBouquet.pop();
            selectedFlowers.removeChild(bouquetItem);
            flower.rendered = true;
            renderOneFlower(flower);
        }
        
        bouquetItem.onclick = (e) => {
            const flowerImg = document.getElementById(`${flower.name}-img`);
            if (e.target.tagName === "IMG" && sound.dataset.action === "off") {
                flowerImg.style.opacity="1";
                sound.play();
                sound.dataset.action = "on";
            } else if (e.target.tagName === "IMG" && sound.dataset.action === "on") {
                sound.pause();
                flowerImg.style.opacity="0.5";
                sound.dataset.action = "off";
            }       
        } 
    })
    renderVisualizer();
}

/*----------------VISUALIZER------------------*/

function renderVisualizer () {
    // Get canvas
    const canvas = document.getElementById("vis");
    const canvasContext = canvas.getContext("2d");

    Object.keys(allSoundsById).forEach((id) => {
        if (!audioContextById[id]) {
            audioContextById[id] = createAudioContext(allSoundsById[id])
        }
    })

    const numBars = 130;

    let barWidth = (canvas.width / numBars) * 30;
    let barHeight;

    function renderFrame() {
     
        const agg = [];
        const freqDataMany = [];
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        requestAnimationFrame(renderFrame);
        
        audioContextArr = Object.values(audioContextById);
  
        audioContextArr.forEach((audioContextObj) => {
            let freqData = audioContextObj.freqData;
            audioContextObj.analyser.getByteFrequencyData(freqData);
            freqDataMany.push(freqData);
        })
        
        if (audioContextArr.length > 0) {
            for (let i = 0; i < freqDataMany[0].length; i++) {
                agg.push(0);
                freqDataMany.forEach((data) => {
                agg[i] += data[i];
                });
            }
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 50;

            canvasContext.beginPath();
            canvasContext.arc(centerX, centerY, radius, 0, (2*Math.PI) );
            canvasContext.lineWidth = 1;
            canvasContext.stroke();
            canvasContext.closePath();
    
            for (let i = 0; i < (numBars); i++) {
                barHeight = (agg[i] * 0.4);
                barWidth = 3;

                
                let rads = (Math.PI * 2) / numBars;
                let x = centerX + Math.cos(rads * i) * (radius);
                let y = centerY + Math.sin(rads * i) * (radius);
                let x_end = centerX + Math.cos(rads * i) * (radius + barHeight);
                let y_end = centerY + Math.sin(rads * i) * (radius + barHeight);

                drawBar(canvasContext, x, y, x_end, y_end, barWidth)
            }
        }  
    }
    renderFrame();
}
    

function drawBar(canvasContext, x1, y1, x2, y2, width){
    const gradient = canvasContext.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, "rgb(211, 197, 222)");
    gradient.addColorStop(0.8, "rgb(255, 230, 250)");
    gradient.addColorStop(1, "white");
    
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = gradient;
    canvasContext.beginPath();
    canvasContext.moveTo(x1,y1);
    canvasContext.lineTo(x2,y2);
    canvasContext.stroke();
    canvasContext.closePath();
}

function createAudioContext (sound) {
    const audioContext = new AudioContext();
     // Create new audio context with given sound
    const src = audioContext.createMediaElementSource(sound);
    
     // Create analyser (gets lots o data bout audio)
    const analyser = audioContext.createAnalyser(); 
 
     // Array limited to unsigned int values 0-255
    const bufferLength = analyser.frequencyBinCount;

    const freqData = new Uint8Array(bufferLength);

    src.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextObj = {
        freqData,
        analyser
    }

    return audioContextObj; 
}


/*----------------INITIAL-RENDER-----------------*/

function init() {

    fetch("https://peaceful-caverns-10688.herokuapp.com/flowers")
        .then(r => r.json())
        .then(data => {
            renderAllFlowers(data);
        })

    fetch("https://peaceful-caverns-10688.herokuapp.com/bouquets")
        .then(r => r.json())
        .then(data => {
            pushSavedBouquets(data);
            renderAllBouquets(data);
        })
 }


 init();

}); // end of DOM Content Loaded


