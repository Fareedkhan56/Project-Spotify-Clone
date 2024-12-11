let currentSong = new Audio();
let nasheeds;
let currFolder;

function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSEconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSEconds}`;
}

const getNasheed = async (folder) => {
    currFolder = folder;
    console.log(currFolder)
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');

    nasheeds = [];

    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        if (element.href.endsWith('.mp3')) {
            nasheeds.push(element.href)
        }
    }

    let songsUl = document.querySelector('.songsList').getElementsByTagName('ul')[0];
    songsUl.innerHTML = '';

    for (let iterator of nasheeds) {
        iterator = iterator.split('nasheeds/')[1]
        songsUl.innerHTML += `<li>
        <img src="./svgs/music.svg" alt="music">
        <div class="info">
            <div>${iterator.replaceAll('%20', ' ').split('/')[1]} </div>
            <div>Fareed</div>
        </div>
        <div class="playNow">
            <div>Play Now</div>
            <img class="invert" src="./svgs/play.svg" alt="play">
        </div>
      </li>`
    }

    let lis = Array.from(document.querySelector('.songsList').getElementsByTagName('li'));
    lis.forEach(e => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    });
}

const playMusic = (track) => {
    currentSong.src = `/${currFolder}/` + track;
    currentSong.play();
    play.src = './svgs/pause.svg';

    document.querySelector('.songInfo').innerHTML = track;
    document.querySelector('.songTime').innerHTML = '00:00 / 00:00';
}

const main = async () => {
    nasheeds = await getNasheed('nasheeds/maher zain');
    currentSong.src = '';

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            play.src = './svgs/pause.svg';
            currentSong.play();
        }
        else {
            play.src = './svgs/play.svg';
            currentSong.pause();
        }
    });

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songTime').innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`;

        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    });

    document.querySelector('.seekBar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.leftBox').style.left = '0';
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.leftBox').style.left = '-120%';
    });

    document.querySelector('.volumeRange').addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    Array.from(document.getElementsByClassName('card')).forEach(element => {
        element.addEventListener('click', async item => {
            nasheeds = await getNasheed(`nasheeds/${item.currentTarget.dataset.folder}`);
        })
    });
}

main()

