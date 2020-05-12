import Actors from './people/actors.js';
import Music from './people/music.js';
import MiscSports from './people/miscSports.js';
import Nba from './people/nba.js';
import Nfl from './people/nfl.js';
import Nhl from './people/nhl.js';
import Mlb from './people/mlb.js';
import Other from './people/other.js';

const categories = document.querySelectorAll('.profession-selector li');
const outOf = document.getElementById('outOf');
const alreadyGot = document.querySelector('.correct-guesses ul');
const initials = document.querySelector('.initials');
const guess = document.querySelector('input');
const lastGuess = document.querySelector('.last-wrong-guess');
const button = document.querySelector('.guesses button');

const totalSkipped = document.querySelector('.skipped .number');
const countdown = document.querySelector('.pick-time .number');
const changeTimeButtons = document.querySelectorAll('.pick-time button');
const totalCorrect = document.querySelector('.correct .number');

const hint1 = document.querySelector('.hint');
const hint2 = document.querySelectorAll('.hint')[1];
const hint3 = document.querySelectorAll('.hint')[2];
const skip = document.querySelectorAll('.hint')[3];

let correctCounter = 0;
let initialTime = 90;
let selected;
let skipped = 0;
let solution;
let taken = [];
let time;
let timerId;
let topic;
let topicOgLength;
const topics = [Actors, Music, MiscSports, Nba, Mlb, Nfl, Nhl, Other];

countdown.textContent = initialTime;

function timer() {
  if (time <= 0) {
    clearInterval(timerId);
    disableTimerChange(false);
    initials.textContent = 'Game Over';
    solution = undefined;
  }
  countdown.textContent = time;
  time -= 1;
  if (time === -1) {
    countdown.textContent = initialTime;
  }
}

const startTimer = () => {
  timer();
  timerId = setInterval(timer, 1000);
};

function changeTime(a) {
  console.log(a);
  if (a === 'sub') initialTime -= 10;
  if (a === 'add') initialTime += 10;
  countdown.textContent = initialTime;
}

function disableTimerChange(bool) {
  changeTimeButtons[0].disabled = bool;
  changeTimeButtons[1].disabled = bool;
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNewInitials() {
  lastGuess.textContent = '';
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

function getLengthsOfNames() {
  if (solution) {
    let names = solution.name.split(' ');
    let combinedLengths = names.map(name => name.length);
    hint3.textContent = combinedLengths.join('-');
  }
}

function skipInitials() {
  if (solution) {
    if (topic.length < 2) return (skip.textContent = 'no more skips');
    resetHints();
    guess.value = '';
    getNewInitials();
    skipped += 1;
    totalSkipped.textContent = skipped;
    initials.textContent = getNewInitials();
  }
}

function resetHints() {
  hint1.textContent = 'hint 1';
  hint2.textContent = 'hint 2';
  hint3.textContent = 'lengths';
  skip.textContent = 'skip';
}

function resetBoard() {
  correctCounter = 0;
  totalCorrect.textContent = correctCounter;
  outOf.textContent = '';
  alreadyGot.textContent = '';
  totalSkipped.textContent = 0;
  taken = [];
  time = initialTime;
  resetHints();
  clearInterval(timerId);
}

function onCategorySelect(x, i) {
  resetBoard();
  if (selected) {
    let active = document.querySelector('.active');
    active.classList.toggle('active');
  }
  x.classList.toggle('active');
  selected = x.textContent;

  topic = [...topics[i]];
  topicOgLength = topics[i].length;
  initials.textContent = getNewInitials();
  if (initials.textContent === '') {
    initials.textContent = 'Got Them All';
  }
  disableTimerChange(true);
  startTimer();
}

function checkGuess() {
  if (time < 0) return;
  if (guess.value.length < 1 || solution === undefined) return;
  if (guess.value.toLowerCase() === solution.name.toLowerCase()) {
    correctCounter += 1;
    totalCorrect.textContent = correctCounter;

    taken.push(solution.name);
    outOf.textContent = `(${taken.length}/${topicOgLength})`;
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(solution.name));
    alreadyGot.insertBefore(li, alreadyGot.childNodes[0]);

    getNewInitials();

    if (solution === undefined) {
      initials.textContent = 'Got Them All';
      clearInterval(timerId);
    } else {
      initials.textContent = getNewInitials();
    }
    resetHints();
  } else {
    lastGuess.textContent = guess.value;
  }
  guess.value = '';
}

changeTimeButtons[0].addEventListener('click', () => changeTime('sub'));

changeTimeButtons[1].addEventListener('click', () => changeTime('add'));

categories.forEach((x, i) => x.addEventListener('click', () => onCategorySelect(x, i)));

button.addEventListener('click', checkGuess);

guess.onkeydown = e => {
  if (e.keyCode === 13) {
    button.click();
  }
};

hint1.addEventListener('click', () => {
  if (solution) hint1.textContent = solution.hint1;
});

hint2.addEventListener('click', () => {
  if (solution) hint2.textContent = solution.hint2;
});

hint3.addEventListener('click', getLengthsOfNames);

skip.addEventListener('click', skipInitials);
