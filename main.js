const characterElmBoy = document.querySelector('#character-boy');
const characterElmGirl = document.getElementById('character-girl');
const startScreen = document.getElementById('start-screen');
let soundElm = document.getElementById('sound-element');

/*intro music*/


/*start screen*/
await new Promise(async (resolve) => {
// document.getElementById('start-screen').addEventListener('keydown', (e) => {
//     alert(e.code)
//
// })

    const btnPlay = document.getElementById('btn-play');

    startScreen.style.top = `${innerHeight / 2 - startScreen.offsetHeight / 2}px`;
    startScreen.style.left = `${innerWidth / 2 - startScreen.offsetWidth / 2}px`;
    btnPlay.addEventListener('click', async () => {
        console.log("Play button is clicked");
        await document.querySelector('html').requestFullscreen({
            navigationUI: 'hide'
        });
        document.querySelector('#start-screen').remove();
        document.body.backgroundImage = `url('/image/BG.png')`;
        const audioElm = document.createElement('audio');
        audioElm.src = '/audio/intro.mp3';
        startScreen.appendChild(audioElm);
        audioElm.volume = 0.5;
        await audioElm.play();
        resolve();
    });
});


/*progress bar*/
await new Promise(function (resolve) {
    const images = ['/image/BG.png',
        '/image/tile/Tile (1).png',
        '/image/tile/Tile (2).png',
        '/image/tile/Tile (3).png',
        `/image/character-girl/Kunai.png`,
        ...Array(10).fill('/image/character-boy')
            .flatMap((v, i) => [
                `${v}/Jump__00${i}.png`,
                `${v}/Idle__00${i}.png`,
                `${v}/Run__00${i}.png`,
                `${v}/Dead__00${i}.png`,
                `${v}/Glide_00${i}.png`
            ]),
        ...Array(10).fill('/image/character-girl')
            .flatMap((v, i) => [
                `${v}/Jump__00${i}.png`,
                `${v}/Idle__00${i}.png`,
                `${v}/Run__00${i}.png`,
                `${v}/Jump_Throw__00${i}.png`,
                `${v}/Throw__00${i}.png`
            ])
    ];

    let y = 0;
    for (const image of images) {
        const img = new Image();
        // console.log(img,y++);
        img.src = image;
        img.addEventListener('load', progress);
        // console.log(y++);
    }

    const barElm = document.getElementById('bar');
    const totalImages = images.length;

    function progress(e) {
        // console.log(y++);
        images.pop();

        barElm.style.width = `${(totalImages - images.length) / totalImages * 100}%`
        if (!images.length) {
            const overlay = document.getElementById('overlay');
            setTimeout(() => {
                overlay.classList.add('hide');
                resolve();
            }, 2500);

        }
    }

});


characterElmGirl.style.left = `${innerWidth - characterElmGirl.offsetWidth - 10}px`;
characterElmGirl.style.top = `${innerHeight - characterElmGirl.offsetHeight - 150}px`;

let dy = 10;                    // Initial Fall
let dx = 0;
let boyDieCount = 0
let i = 0;                      // Rendering
let t = 0;
let run = false;
let jump = false;
let glide = true;
let girlAttack = false;
let angle = 0;
let tmr4Jump;
let tmr4Run;
let tmr4ThrowKunaiJump;
let kunaiThrow = false;
let kunaiThrowJump = false;
let runGirl = false;
let boyDie = false;
let boyAttack = false;
const boyActions = (e) => {
    switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
            if (glide === true) {
                return;
            }
            doRun(e.code === "ArrowLeft");
            break;
        case "Space":
        case "ArrowUp":
            doJump();
            break;
        case "KeyG":
            removeGlide();
            break;
        case "KeyA":
            doAttackBoy();
            setTimeout(() => {
                boyAttack = false;
            }, 200);
    }
};
const actionArray = [throwKunai, throwKunaiJump, doRunAndThrow];


/* Rendering Function - Boy */
const tmr4RenderingBoy = setInterval(() => {

    if (boyAttack) {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Attack__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }
    } else if (boyDie) {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Dead__00${boyDieCount++}.png')`;
        if (boyDieCount === 10) {
            boyDie = false;
            soundElm = null;
            removeEventListener('keydown', boyActions, true);

            clearInterval(tmr4RenderingBoy);
            // clearInterval(tm4GirlAction);
            clearInterval(tmr4girlAttack);

            setTimeout(() => {
                const gameOver = document.querySelector('.game-over-screen');
                console.log(gameOver.offsetWidth, gameOver.offsetHeight);
                gameOver.style.left = `${(innerWidth / 2) - gameOver.offsetWidth / 2}px`;
                gameOver.style.top = `${(innerHeight / 2) - gameOver.offsetHeight / 2}px`;
                gameOver.classList.remove('game-over-screen-hide');
                gameOver.classList.add('show-game-over');
            }, 500);
        }
    } else if (glide) {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Glide_00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    } else if (jump) {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Jump__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    } else if (!run) {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Idle__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    } else {
        characterElmBoy.style.backgroundImage =
            `url('/image/character-boy/Run__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    }
}, 1000 / 30);

/*Rendering Function - Girl*/

setInterval(() => {

    if (runGirl) {
        characterElmGirl.style.backgroundImage =
            `url('/image/character-girl/Run__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }
    } else if (girlAttack) {
        characterElmGirl.style.backgroundImage =
            `url('/image/character-girl/Attack__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    } else if (kunaiThrow) {
        characterElmGirl.style.backgroundImage =
            `url('/image/character-girl/Throw__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }
    } else if (kunaiThrowJump) {
        characterElmGirl.style.backgroundImage =
            `url('/image/character-girl/Jump_Throw__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    } else {
        characterElmGirl.style.backgroundImage =
            `url('/image/character-girl/Idle__00${i++}.png')`;
        if (i === 10) {
            i = 0;
        }

    }
}, 1000 / 30);

/*Girl's Actions*/
const tm4GirlAction = setInterval(() => {
    if (glide) return;
    let index = Math.floor(Math.random() * actionArray.length);
    let action = actionArray[index];
    // console.log(action);
    action();
}, 2000);


//Glide fall down
const tmr4Glide = setInterval(() => {
    const top = characterElmBoy.offsetTop + 10;
    characterElmBoy.style.top = `${top}px`;
    if (characterElmBoy.offsetTop >= (innerHeight - characterElmBoy.offsetHeight * 3)) {
        glide = false;
        clearInterval(tmr4Glide);
    }
}, 150);

/*Sounds for actions*/
async function playSound(action) {
    const audioElm = document.createElement('audio');

    switch (action) {
        case 'run':
            audioElm.src = 'audio/foot_step.mp3';
            break;
        case 'jump':
            audioElm.src = 'audio/jump.mp3';
            break
        case 'die':
            audioElm.src = 'audio/blood.mp3';
            break;
        case 'hit':
            audioElm.src = 'audio/die.mp3';
            break;
        case 'kuani':
            audioElm.src = 'audio/kunai.mp3';
            break;
        case 'kunai-and-sword':
            audioElm.src = 'audio/sword+kunai.mp3';
            break;
        case 'sword':
            audioElm.src = 'audio/sword.mp3';

    }

    soundElm.appendChild(audioElm);
    audioElm.volume = 0.35;
    await audioElm.play();
    setTimeout(() => {
        audioElm.remove();
        console.log('audio removed', action)
    }, 500);
}

// Initially Fall Down
const tmr4InitialFall = setInterval(() => {
    const top = characterElmBoy.offsetTop + (t++ * 0.3);
    characterElmBoy.style.top = `${top}px`
    if (characterElmBoy.offsetTop >= (innerHeight - 150 - characterElmBoy.offsetHeight)) {
        characterElmBoy.style.top = `${innerHeight - 150 - characterElmBoy.offsetHeight}px`
        clearInterval(tmr4InitialFall);
    }
}, 100);

/*Boy Attack*/
function doAttackBoy() {
    playSound('sword');
    boyAttack = true;
}

/*Girl attack when boy gets close*/

const tmr4girlAttack = setInterval(() => {

    if (characterElmBoy.getBoundingClientRect().x >= characterElmGirl.getBoundingClientRect().x - 125) {
        doGirlAttack();
        dieBoy();
        clearInterval(tmr4girlAttack);
    }
}, 10)

// Jump / Boy
function doJump() {
    if (tmr4Jump) return;
    playSound('jump');
    jump = true;
    const initialTop = characterElmBoy.offsetTop;
    tmr4Jump = setInterval(() => {
        const top = initialTop - (Math.sin(toRadians(angle++))) * 150;
        characterElmBoy.style.top = `${top}px`
        if (angle === 181) {
            clearInterval(tmr4Jump);
            tmr4Jump = undefined;
            jump = false;
            angle = 0;
        }
    }, 1);
}

// Run / Boy
function doRun(left) {
    if (tmr4Run) return;
    run = true;
    playSound("run");
    i = 0;
    if (left) {
        dx = -10;
        characterElmBoy.classList.add('rotate');
    } else {
        dx = 10;
        characterElmBoy.classList.remove('rotate');
    }
    tmr4Run = setInterval(() => {
        if (dx === 0) {
            clearInterval(tmr4Run);
            tmr4Run = undefined;
            run = false;
            return;
        }
        const left = characterElmBoy.offsetLeft + dx;
        if (left + characterElmBoy.offsetWidth >= innerWidth || left <= 0) {
            if (left <= 0) {
                characterElmBoy.style.left = '0';
            } else {
                characterElmBoy.style.left = `${innerWidth - characterElmBoy.offsetWidth - 1}px`;
            }
            dx = 0;
            return;
        }
        characterElmBoy.style.left = `${left}px`;
    }, 20);
}

// Remove from glide

function removeGlide() {
    glide = false;
    const tmr4InitialFall = setInterval(() => {
        const top = characterElmBoy.offsetTop + (t++);
        characterElmBoy.style.top = `${top}px`
        if (characterElmBoy.offsetTop >= (innerHeight - 150 - characterElmBoy.offsetHeight)) {
            clearInterval(tmr4InitialFall);
        }
    }, 100);
}

function dieBoy(action) {
    // playSound(action);
    boyDie = true;
}

// Throw Kunai

function throwKunai() {
    kunaiThrow = true;
    kunai();
}

// Throw Kunai Jump
function throwKunaiJump() {
    // playSound('kunai');
    kunaiThrowJump = true;
    const initialTop = characterElmGirl.offsetTop;
    tmr4ThrowKunaiJump = setInterval(() => {
        const top = initialTop - (Math.sin(toRadians(angle++))) * 150;
        characterElmGirl.style.top = `${top}px`
        if (angle === 181) {
            clearInterval(tmr4ThrowKunaiJump);
            tmr4ThrowKunaiJump = undefined;
            kunaiThrowJump = false;
            angle = 0;
        }
    }, 1);
    kunai();
}

// Kunai
function kunai() {
    const kunaiElm = document.createElement('div');
    kunaiElm.id = 'kunai'
    // kunaiElmGlobal = document.getElementById('kunai');
    document.body.append(kunaiElm);
    playSound('kunai');
    const girlRect = characterElmGirl.getBoundingClientRect();

    kunaiElm.style.position = 'absolute';
    kunaiElm.style.left = `${girlRect.x - kunaiElm.offsetWidth / 2}px`;
    kunaiElm.style.top = `${girlRect.y + characterElmGirl.offsetHeight / 2}px`;

    let kunaDx = kunaiElm.getBoundingClientRect().x;

    const tmr4kunai = setInterval(() => {

        kunaiElm.style.left = `${kunaDx}px`;
        kunaDx -= 10;

        let kunaiRect = kunaiElm.getBoundingClientRect();
        let boyRect = characterElmBoy.getBoundingClientRect();
        // console.log('BoyX:', boyRect.x, 'KunaiX:', kunaiRect.x, 'dead:', boyDie);


        if (
            // (kunaiRect.x <= (boyRect.x + characterElmBoy.offsetWidth / 2)) && (kunaiRect.y <= (boyRect.y + characterElmBoy.offsetHeight))
            //(kunaiElm.offsetLeft <= (characterElmBoy.offsetLeft + characterElmBoy.offsetWidth / 2)) && (kunaiElm.offsetTop <= (characterElmBoy.offsetTop + characterElmBoy.offsetHeight))
            characterElmBoy.offsetLeft <= kunaiElm.offsetLeft && characterElmBoy.offsetLeft + characterElmBoy.offsetWidth >= kunaiElm.offsetLeft &&
            characterElmBoy.offsetTop <= kunaiElm.offsetTop && characterElmBoy.offsetTop + characterElmBoy.offsetHeight >= kunaiElm.offsetTop && boyAttack === false
        ) {
            dieBoy();
            playSound('hit');
            kunaiElm.remove();
            clearInterval(tmr4kunai);
            // debugger;
        } else if (boyAttack === true && characterElmBoy.offsetLeft + characterElmBoy.offsetWidth + 10 >= kunaiElm.offsetLeft) {
            // playSound('kunai-and-sword')
            kunaiElm.remove();
        } else if (kunaiElm.getBoundingClientRect().x <= 10) {
            kunaiElm.remove();
        }


    }, 10);

    setTimeout(() => {
        kunaiThrow = false;
        kunaiThrowJump = false;
    }, 500);
}

/*Girl Attack*/

function doGirlAttack() {
    girlAttack = true;
    // playSound('sword');
    playSound('die');
    setTimeout(() => {
        girlAttack = false;
    }, 500);
}

/*Girl Run and throw*/

function doRunAndThrow() {
    playSound('kunai');
    runGirl = true;
    const initialPosition = characterElmGirl.getBoundingClientRect().x;
    let girlDx = initialPosition;
    const tmr4RunAndThrow = setInterval(() => {
        characterElmGirl.style.left = `${girlDx}px`;
        girlDx -= 5;

        if (characterElmGirl.offsetLeft <= initialPosition - 200) {
            runGirl = false;
            throwKunai();
            doReverse();
            clearInterval(tmr4RunAndThrow);
        }

    }, 20);
}

function doReverse() {
    console.log('reverse executed');
    runGirl = true;

    let girlDx = characterElmGirl.offsetLeft;
    const tmr4Reverse = setInterval(() => {
        characterElmGirl.style.left = `${girlDx}px`;
        girlDx += 5;

        if (characterElmGirl.offsetLeft >= innerWidth - characterElmGirl.offsetWidth - 10) {
            runGirl = false;
            // throwKunai();
            clearInterval(tmr4Reverse);
        }
    }, 20);

}


// Utility Fn (Degrees to Radians)
function toRadians(angle) {
    return angle * Math.PI / 180;
}

// Event Listeners
addEventListener('keydown', boyActions, true);

addEventListener('keyup', (e) => {
    switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
            dx = 0;
    }
});

addEventListener('resize', () => {
    characterElmBoy.style.top = `${innerHeight - 150 - characterElmBoy.offsetHeight}px`;
    if (characterElmBoy.offsetLeft <= 0) {
        characterElmBoy.style.left = '0';
    } else if (characterElmBoy.offsetLeft >= innerWidth) {
        characterElmBoy.style.left = `${innerWidth - characterElmBoy.offsetWidth - 1}px`;
    }
    characterElmGirl.style.top = `${innerHeight - 150 - characterElmBoy.offsetHeight}px`;
    characterElmGirl.style.left = `${innerWidth - characterElmGirl.offsetWidth - 10}px`;
});

const btnReplay = document.getElementById('btn-replay');
btnReplay.addEventListener('click', () => {
    console.log('replay button clicked');
    location.reload();
});

const btnExitElms = document.querySelectorAll('.btn-exit');

btnExitElms.forEach((btnExit) => {
    console.log("exit buttons iterated");
    btnExit.addEventListener('click', () => {
        console.log("exit button clicked");
        window.close();
    });

});