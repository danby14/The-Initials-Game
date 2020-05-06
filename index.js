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
let topic;
let correctCounter = 0;

const categories = document.querySelectorAll('.profession-selector li');
const alreadyGot = document.querySelector('.correct-guesses ul');
const selectedCategory = document.getElementById('chosen-category');
const initials = document.querySelector('.initials');
const guess = document.querySelector('input');
const lastGuess = document.querySelector('.last-wrong-guess');
const button = document.querySelector('button');
const answer = document.querySelector('.answer');
const totalCorrect = document.querySelector('.correct .number');

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let selected;
let solution;
// turn correct guesses into an array
// const uls = document.querySelectorAll('.correct-guesses ul')[0].innerText;
// uls.split('\n')
function getNewInitials() {
  selected = selectedCategory.textContent;
  if (taken.length === topics[topic].length) {
    return (solution = undefined);
  }
  solution = topics[topic][getRandom(0, 7)];
  if (taken.includes(solution)) {
    return getNewInitials();
  }
  // solution = NBA[getRandom(0, 7)];
  return solution
    .split(' ')
    .map(n => n[0])
    .join('.');
}

// initials.textContent = getNewInitials() + '.';

categories.forEach((x, i) =>
  x.addEventListener('click', () => {
    correctCounter = 0;
    totalCorrect.textContent = correctCounter;

    alreadyGot.textContent = '';
    taken = [];
    selectedCategory.textContent = x.textContent;
    selected = x.textContent;
    topic = i;
    initials.textContent = getNewInitials() + '.';
    console.log(topic);
    console.log(selected);
  })
);

guess.onkeydown = e => {
  if (e.keyCode === 13) {
    button.click();
  }
};

button.addEventListener('click', () => {
  if (guess.value.length < 1 || solution === undefined) return;
  if (guess.value.toLowerCase() === solution.toLowerCase()) {
    console.log('correct');
    correctCounter += 1;
    totalCorrect.textContent = correctCounter;

    let li = document.createElement('li');
    li.appendChild(document.createTextNode(solution));
    alreadyGot.appendChild(li);
    taken.push(solution);

    getNewInitials();
    if (solution === undefined) {
      initials.textContent = 'Got Them All';
    } else {
      initials.textContent = getNewInitials() + '.';
    }

    lastGuess.textContent = '';
  } else {
    console.log('wrong');
    lastGuess.textContent = guess.value;
  }
  // selectedCategory.textContent = guess.value;
  guess.value = '';
});
