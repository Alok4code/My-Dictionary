let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let notFound = document.querySelector('.not-found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let apiKey = '74a43940-c8f7-4e34-9f50-0ffbda2e7f88';

searchBtn.addEventListener('click', function (e) {
  e.preventDefault();

  //clear old data
  audioBox.innerHTML = '';
  notFound.innerHTML = '';
  defBox.innerText = '';

  //Get input Data
  let word = input.value;

  //call API get data
  if (word == '') {
    alert('Word is required!');
    return;
  }

  getData(word);
});

async function getData(word) {
  loading.style.display = 'block';
  // Ajax-call get data
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();

  // if empty result
  if (!data.length) {
    loading.style.display = 'none';
    notFound.innerText = 'No Result Found.';
    return;
  }

  //if result is suggestion
  if (typeof data[0] === 'string') {
    loading.style.display = 'none';
    let heading = document.createElement('h3');
    heading.innerText = 'did you mean?';
    notFound.appendChild(heading);
    data.forEach((element) => {
      let suggestion = document.createElement('span');
      suggestion.classList.add('suggested');
      suggestion.innerText = element;
      notFound.appendChild(suggestion);
      suggestion.onclick = () => {
        // console.log(element);
        document.getElementById('input').value = element;
      };
    });

    return;
  }

  //result found
  loading.style.display = 'none';
  let defination = data[0].shortdef[0];
  defBox.innerText = defination;

  //---------------------------------------------
  //history list create
  if (defination != null) {
    let historyList = document.getElementById('history-list');
    let li = document.createElement('li');
    let textValue = document.createTextNode(input.value + ' : ' + defination);
    li.appendChild(textValue);
    historyList.appendChild(li);
  }

  //-------------------------------------------
  //Sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }
}

function renderSound(soundName) {
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  let aud = document.createElement('audio');
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}

//refresh the page
function refresh() {
  // window.location.reload('Refresh');
  input.value = '';
  audioBox.innerHTML = '';
  notFound.innerHTML = '';
  defBox.innerText = '';
}

//history Show-hide
function showHistory() {
  let historyData = document.querySelector('.history-data');
  if (historyData.style.display === 'none') {
    historyData.style.display = 'block';
  } else {
    historyData.style.display = 'none';
  }
}

//Clear all historyData
function clearHistory() {
  let historyList = document.getElementById('history-list');
  let historyData = document.querySelector('.history-data');
  if (historyList.getElementsByTagName('li').length == 0) {
    historyData.style.display = 'none';
    alert("You don't have history.");
  } else {
    if (confirm('delete all history?')) {
      document.getElementById('history-list').innerHTML = '';
      historyData.style.display = 'none';
    } else {
    }
  }
}
function time() {
  let dt = new Date();
  document.getElementById('pickDate').innerHTML = dt.toLocaleString();
  setTimeout(time, 1000);
}
time();

function toggleBtn() {
  let element = document.body;
  element.classList.toggle('dark-mode');
  if (element.classList.contains('dark-mode')) {
    document.getElementById('myImg').src = './img/light-mode.png';
    document.getElementById('def').style.color = 'white';
  } else {
    document.getElementById('myImg').src = './img/dark-mode.png';
    document.getElementById('def').style.color = 'black';
  }
}
