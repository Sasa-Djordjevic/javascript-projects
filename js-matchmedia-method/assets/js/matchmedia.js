const islands = document.querySelectorAll('#s2-image1, #s2-image2, #s2-image3, #s2-image4, #s2-image6, #s2-image7, #s2-image8');
const backgroundField = document.querySelector('.mygridSec2Div2');

const field = document.querySelector('.fieldImage');
const fieldDiv = document.getElementById('fieldDiv');
const fieldButton = document.getElementById('fieldButton');
const fieldName = document.getElementById('fieldName');
const fieldText = document.getElementById('fieldText');

const textLefkada = "Lefkada is a Greek island in the Ionian Sea. West coast beaches like Porto Katsiki and Egremni feature sheer cliffs and turquoise waters. The east coast is known for its traditional villages. In the north, Lefkada town is the island's gateway and capital.";
const nameLefkada = "Lefkada";
const imageLefkada = 'url("assets/images/greek-islands/lefkada-1.jpg")';

const textCorfu = "Corfu, an island off Greece’s northwest coast in the Ionian Sea. Its cultural heritage reflects years spent under Venetian, French, and British rule before it was united with Greece in 1864.";
const nameCorfu = "Corfu";
const imageCorfu = 'url("assets/images/greek-islands/corfu-1.jpg")';

const textThasos = "Thasos is a Greek island in the North Aegean Sea. It is the northernmost major Greek island. The island has an area of 380 km² and a population of about 13,000. Thassos is famed for its wine with its distinctive apple aroma.";
const nameThasos = "Thasos";
const imageThasos = 'url("assets/images/greek-islands/thasos-1.jpg")';

const textMykonos = "Mykonos is an island in the Cyclades group in the Aegean Sea. It's popularly known for its summer party atmosphere with bars and dance clubs that attract world-renowned DJs and typically stay open well past dawn.";
const nameMykonos = "Mykonos";
const imageMykonos = 'url("assets/images/greek-islands/mykonos-1.jpg")';

const textCrete = "Crete is the largest island in Greece, and the fifth largest one in the Mediterranean Sea. Crete rests about 160 km south of the Greek mainland. It is a diverse and vibrant island packed with ancient ruins, buzzing cities, and breathtaking beaches.";
const nameCrete = "Crete";
const imageCrete = 'url("assets/images/greek-islands/crete-1.jpg")';

const textZakynthos = "Zakynthos is a Greek island in the Ionian Sea and a well-known summer resort. The harbor city of Zakynthos is the capital and major hub. Popular beaches like Agios Nikolaos, Alykanas, and Tsilivi offer swimming and water sports.";
const nameZakynthos = "Zakynthos";
const imageZakynthos = 'url("assets/images/greek-islands/zakynthos-1.jpg")';

const textSantorini = "Santorini is an island in the southern Aegean Sea, about 200 km southeast of the Greek mainland. The island is known for its whitewashed houses of two principal towns, Fira and Oia, and beaches made up of black, red, and white lava pebbles.";
const nameSantorini = "Santorini";
const imageSantorini = 'url("assets/images/greek-islands/santorini-1.jpg")';

const textIslands = [textLefkada, textCorfu, textThasos, textMykonos, textCrete, textZakynthos, textSantorini];
const nameIslands = [nameLefkada, nameCorfu, nameThasos, nameMykonos, nameCrete, nameZakynthos, nameSantorini];
const imageIslands = [imageLefkada, imageCorfu, imageThasos, imageMykonos, imageCrete, imageZakynthos, imageSantorini];

if (islands){

    islands.forEach( (island, index) => {

        island.addEventListener('click', () => {
            fieldDiv.style.display = "block";
            field.classList.remove('fieldImageColor1');
            field.classList.add('fieldImageColor2');
            fieldName.textContent = nameIslands[index];
            fieldText.textContent = textIslands[index];

            let query = window.matchMedia("(min-width: 768px)"); 

            if (query.matches){
                // when the screen width is larger than 768px
                backgroundField.style.backgroundImage = imageIslands[index];
            }
        });
    });
}

fieldButton.addEventListener('click', () => {
    fieldDiv.style.display = "none";
    field.classList.remove('fieldImageColor2');
    field.classList.add('fieldImageColor1');
});

let queryResize = window.matchMedia("(min-width: 768px)");

function widthScreenChange(query) {
    if (!query.matches) {
        // when the screen width is smaller than 768px
        backgroundField.style.backgroundImage = "none";
    } else {
        backgroundField.style.backgroundImage = imageIslands[6];
        fieldName.textContent = nameIslands[6];
        fieldText.textContent = textIslands[6];
    }   
}

queryResize.addEventListener('change', widthScreenChange);
