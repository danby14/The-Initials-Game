import Actors from './people/actors.js';
import Music from './people/music.js';
import MiscSports from './people/miscSports.js';
import Nba from './people/nba.js';
import Nfl from './people/nfl.js';
import Nhl from './people/nhl.js';
import Mlb from './people/mlb.js';
import Other from './people/other.js';

const topics = [Actors, Music, MiscSports, Nba, Mlb, Nfl, Nhl, Other];
let taken = [];
let topicsIndex;
let correctCounter = 0;

const categories = document.querySelectorAll('.profession-selector li');
const alreadyGot = document.querySelector('.correct-guesses ul');
const initials = document.querySelector('.initials');
const guess = document.querySelector('input');
const lastGuess = document.querySelector('.last-wrong-guess');
const button = document.querySelector('button');
const totalCorrect = document.querySelector('.correct .number');
const hint1 = document.querySelector('.hint');
const hint2 = document.querySelectorAll('.hint')[1];
const hint3 = document.querySelectorAll('.hint')[2];
const skip = document.querySelectorAll('.hint')[3];

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let selected;
let solution;

function getNewInitials() {
  let topic = topics[topicsIndex];
  34;
  let random = getRandom(0, topic.length - 1);
  if (topic.length < 1) {
    return (solution = undefined);
  }
  solution = topic[random];
  if (taken.includes(solution.name)) {
    topic.splice(random, 1);
    return getNewInitials();
  }
  return solution.initials;
}

categories.forEach((x, i) =>
  x.addEventListener('click', () => {
    // to reset correct counter on category change
    // correctCounter = 0;
    // totalCorrect.textContent = correctCounter;

    // alreadyGot.textContent = '';
    // taken = [];
    if (selected) {
      let canada = document.querySelector('.active');
      canada.classList.toggle('active');
    }
    x.classList.toggle('active');
    selected = x.textContent;
    topicsIndex = i;
    resetHints();
    initials.textContent = getNewInitials();
    if (initials.textContent === '') {
      initials.textContent = 'Got Them All';
    }
  })
);

guess.onkeydown = e => {
  if (e.keyCode === 13) {
    button.click();
  }
};

button.addEventListener('click', () => {
  if (guess.value.length < 1 || solution.name === undefined) return;
  if (guess.value.toLowerCase() === solution.name.toLowerCase()) {
    console.log('correct');
    correctCounter += 1;
    totalCorrect.textContent = correctCounter;

    let li = document.createElement('li');
    li.appendChild(document.createTextNode(solution.name));
    alreadyGot.insertBefore(li, alreadyGot.childNodes[0]);
    // alreadyGot.appendChild(li);

    taken.push(solution.name);

    getNewInitials();
    if (solution === undefined) {
      initials.textContent = 'Got Them All';
    } else {
      initials.textContent = getNewInitials();
    }

    lastGuess.textContent = '';
  } else {
    console.log('wrong');
    lastGuess.textContent = guess.value;
  }
  resetHints();
  guess.value = '';
});

function resetHints() {
  hint1.textContent = 'hint 1';
  hint2.textContent = 'hint 2';
}

hint1.addEventListener('click', () => {
  if (solution) hint1.textContent = solution.hint1;
});
hint2.addEventListener('click', () => {
  if (solution) hint2.textContent = solution.hint2;
});
