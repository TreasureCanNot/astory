//document.addEventListener("DOMContentLoaded", function () {
//    document.body.insertAdjacentHTML('afterbegin', '<p style="color:yellow;//">Hate the world</p>');
//});



function changeBackground(color) {
    document.querySelector('.box').style.backgroundColor = color;
}


function controlPad(){
    let navContainer = document.getElementById('navContainer');
    let toggleButton = document.getElementById('toggleButton');

    if (navContainer.classList.contains('moved-navcontainer')){
        navContainer.classList.remove('moved-navcontainer');
        navContainer.classList.add('navcontainer');
        toggleButton.innerHTML = "Show";
    } else {
        navContainer.classList.add('moved-navcontainer');
        navContainer.classList.remove('navcontainer');
        toggleButton.innerHTML = "Hide";
    }
}

let chapterSelectOngoing = false;

function chapterSelect() {
    if (chapterSelectOngoing==true) {
        return;
    }
    chapterSelectOngoing = true;

    let pad = document.getElementById('controlP')
    const links = document.querySelectorAll('.ni')
    const Hlinks = document.querySelectorAll('.NOni')
    let selector = document.getElementById('selector')
    let selectorPhone = document.getElementById('selector-phone')
    let selectionTable = document.getElementById('selection-table')

    if (selectionTable.classList.contains('vanished')) {
        setTimeout(function () {
            selectionTable.classList.remove('vanished');
        }, 100)
        setTimeout(function () {
            selectionTable.classList.remove('invisible');
        }, 130)
    } else {
        selectionTable.classList.add('vanished')
        selectionTable.classList.add('invisible')
    }

    /*
    if (selectionTable.classList.contains('vanished')) {
        setTimeout(function () {
            selectionTable.classList.remove('invisible');
        }, 1000)
    } else {
        selectionTable.classList.add('invisible')
    }*/

    if (pad.classList.contains('controlP')) {
        pad.classList.remove('controlP')
        pad.classList.add('controlP-chapterMode')
    } else {
        pad.classList.remove('controlP-chapterMode')
        pad.classList.add('controlP')
    }

    if (selector.classList.contains('chapter-select')) {
        selector.classList.remove('chapter-select')
        selector.classList.add('chapter-selecting')
    } else {
        selector.classList.remove('chapter-selecting')
        selector.classList.add('chapter-select')
    }

    if (selectorPhone.classList.contains('chapter-select')) {
        selectorPhone.classList.remove('chapter-select')
        selectorPhone.classList.add('chapter-selecting')
    } else {
        selectorPhone.classList.remove('chapter-selecting')
        selectorPhone.classList.add('chapter-select')
    }



    let animationTracker = [];

    // Handle links
    links.forEach(function(element) {
        animationTracker.push(new Promise(resolve => {
            if (element.classList.contains('ni')) {
                element.classList.remove('ni');
                element.offsetHeight; // FORCE reflow (this is the key)
                element.classList.add('NOni');
            }
            setTimeout(() => {
                element.classList.add('vanished');
                resolve();
            }, 100);
        }));
    });

    // Handle Hlinks
    Hlinks.forEach(function(element) {
        animationTracker.push(new Promise(resolve => {
            if (element.classList.contains('vanished')) {
                element.classList.remove('vanished');
            }
            setTimeout(() => {
                if (element.classList.contains('NOni')) {
                    element.classList.remove('NOni');
                    element.offsetHeight; // same reason
                    element.classList.add('ni');
                }
                resolve();
            }, 100);
        }));
    });

    // When all animations are done
    Promise.allSettled(animationTracker).then(function() {
        chapterSelectOngoing = false;
    }).catch(function (error) {
        // If any animation fails:
        console.error("Animation error occurred:", error);
        chapterSelectOngoing = false;  // Still make sure to unlock
        throw error;                   // Re-throw to maintain error propagation
    });
}


let buttons = document.getElementsByClassName('wordtog');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {

    var box = this.parentElement;
    var definitions = box.getElementsByClassName('definition');

    if (definitions.length === 0) return;

    var isHidden = definitions[0].classList.contains('hidden');

    for (var j = 0; j < definitions.length; j++) {
      if (isHidden) {
        definitions[j].classList.remove('hidden');
      } else {
        definitions[j].classList.add('hidden');
      }
    }

    this.textContent = isHidden ? 'Hide definition' : 'Enlighten';
  };
}


//The whole fucking words issue
document.addEventListener('DOMContentLoaded', function() {
    loadGlossary();
  });
  
  function loadGlossary() {
    fetch('words.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var container = document.getElementById('glossary-container');
        container.innerHTML = '';
        
        data.forEach(function(item) {
          if (!item.definitions) { console.log('BROKEN ENTRY:', item); return; }
  
          var wordBox = document.createElement('div');
          wordBox.classList.add('wordbox');
          if (item.category) {
          wordBox.classList.add(item.category);
  }
          wordBox.id = item.word;
          
          var title = document.createElement('p');
          var bold = document.createElement('b');
          bold.textContent = item.word;
          title.appendChild(bold);
          wordBox.appendChild(title);
          
          item.definitions.forEach(function(def) {
              var defPara = document.createElement('p');
              defPara.classList.add('hidden', 'definition');
              if (def.type === 'example') {
                defPara.innerHTML = '<i>' + def.text + '</i>';
              } else {
                defPara.innerHTML = def.text;
              }
              wordBox.appendChild(defPara);
            });
          
          var button = document.createElement('button');
          button.classList.add('wordtog');
          button.textContent = 'Reveal';
          wordBox.appendChild(button);
          
          container.appendChild(wordBox);
        });
        
        initializeRevealButtons();
        initializeSearch();
        handleUrlHash();
      })
      .catch(function(error) {
        console.error('Error loading glossary:', error);
      });
  }
  
  function initializeRevealButtons() {
    var container = document.getElementById('glossary-container');
    container.addEventListener('click', function(event) {
      if (event.target.classList.contains('wordtog')) {
        var box = event.target.closest('.wordbox');
        var definitions = box.querySelectorAll('.definition');
        var isHidden = definitions[0] && definitions[0].classList.contains('hidden');
        
        definitions.forEach(function(def) {
          def.classList.toggle('hidden');
        });
        event.target.textContent = isHidden ? 'Hide' : 'Reveal';
      }
    });
  }
  
  function initializeSearch() {
    var searchInput = document.getElementById('searchbar');
    var wordBoxes = document.querySelectorAll('.wordbox');
  
    searchInput.addEventListener('input', function() {
      var query = searchInput.value.trim().toLowerCase();
  
      wordBoxes.forEach(function(box) {
        var bold = box.querySelector('b');
        var word = bold ? bold.textContent.trim().toLowerCase() : '';
  
        if (query === '' || word.includes(query)) {
          box.style.display = '';
        } else {
          box.style.display = 'none';
        }
      });
    });
  }
  
  function handleUrlHash() {
    if (location.hash) {
      var targetId = decodeURIComponent(location.hash.substring(1));
      var box = document.getElementById(targetId);
  
      if (!box) return;
  
      box.classList.add('redbord');
  
      var definitions = box.getElementsByClassName('definition');
      var button = box.getElementsByClassName('wordtog')[0];
  
      for (var i = 0; i < definitions.length; i++) {
        definitions[i].classList.remove('hidden');
      }
  
      if (button) {
        button.textContent = 'Hide';
      }

      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  

  // ─── LITROCITY CALCULATOR ───────────────────────────────────────────

const LIFESPAN_DAYS        = 32872;
const BABY_LITROCITY       = 4.109;
const ML_PER_LIFE_DAY      = (BABY_LITROCITY * 1000) / LIFESPAN_DAYS;
const MURDER_SENTENCE_DAYS = 25 * 365.25;
const ML_PER_FREEDOM_DAY   = (BABY_LITROCITY * 1000) / MURDER_SENTENCE_DAYS;
const FAINT_LITRES_PER_HOUR = BABY_LITROCITY;
const MJ_PER_LITRE          = 83.68127281577026;

let painEvents       = [];
let psychEvents      = [];
let additionalLosses = [];
let freedomLosses      = [];
let lethalLosses       = [];
let enthalpicLosses    = [];
let freedomCounter     = 0;
let lethalCounter      = 0;
let enthalpicCounter   = 0;

let spreadEvents     = [];

let painCounter    = 0;
let psychCounter   = 0;
let addLossCounter = 0;
let eventCounter   = 0;

// ─── SLIDER / INPUT SYNC ─────────────────────────────────────────────

function sliderToNum(numId, sliderId) {
  document.getElementById(numId).value = document.getElementById(sliderId).value;
}

function clampAndSync(numId, min, max, sliderId) {
  const el = document.getElementById(numId);
  let val = parseFloat(el.value);
  if (isNaN(val)) return;
  if (val < min) { val = min; el.value = min; }
  if (val > max) { val = max; el.value = max; }
  if (sliderId) document.getElementById(sliderId).value = val;
}

// ─── PAIN ─────────────────────────────────────────────────────────────
// Formula: hours × rank × 4.109 × people

function calcPain() {
  let total = 0;
  for (const ev of painEvents) {
    const hours  = parseFloat(ev.hours)  || 0;
    const rank   = parseFloat(ev.rank)   || 0;
    const people = parseFloat(ev.people) || 1;
    total += hours * Math.pow(rank, 2) * FAINT_LITRES_PER_HOUR * people;
  }
  return total;
}

// ─── LOSS ─────────────────────────────────────────────────────────────

function calcLoss() {
  const timeLoss      = freedomLosses.reduce((sum, ev) => {
    const days = parseFloat(ev.days) || 0;
    return sum + (days * ML_PER_FREEDOM_DAY) / 1000;
  }, 0);

  const lethalLoss    = lethalLosses.reduce((sum, ev) => {
    const lives = parseFloat(ev.lives) || 0;
    return sum + lives * BABY_LITROCITY;
  }, 0);

  const enthalpicLoss = enthalpicLosses.reduce((sum, ev) => {
    const mj = parseFloat(ev.mj) || 0;
    return sum + mj / MJ_PER_LITRE;
  }, 0);

  const additionalLoss = additionalLosses.reduce((sum, ev) => {
    const rank   = parseFloat(ev.rank)   || 0;
    const amount = parseFloat(ev.amount) || 0;
    return sum + (rank * BABY_LITROCITY * amount);
  }, 0);

  setText('timeLossResult',       timeLoss.toFixed(6)       + ' L');
  setText('lethalLossResult',     lethalLoss.toFixed(6)     + ' L');
  setText('enthalpicLossResult',  enthalpicLoss.toFixed(6)  + ' L');
  setText('additionalLossResult', additionalLoss.toFixed(6) + ' L');

  return timeLoss + lethalLoss + enthalpicLoss + additionalLoss;
}

// ─── PSYCHOLOGICAL ────────────────────────────────────────────────────
// Initial: hours × rank × 4.109 (fully independent of physical pain)
// After phases: piecewise formula on that initial value
// Overall per entry: result × people

function psychFormula(i, q, t) {
  if (i === 0) return 0;
  const tYears = t / 365.25;
  let result;
  if (q >= 0) result = -Math.pow((q / i) + 1, tYears) + i + 1;
  else        result =  Math.pow((-q * i)/(tYears) + 1, tYears) + i - 1;
  return Math.max(result, 0);
}

/** 5.195813 */

function calcPsych() {
  let total = 0;
  for (const ev of psychEvents) {
    const hours  = parseFloat(ev.hours)  || 0;
    const rank   = parseFloat(ev.rank)   || 0;
    const people = parseFloat(ev.people) || 1;
    let cur = 1 * Math.pow(rank, 2) * BABY_LITROCITY;
    let change = 0
    for (const p of ev.phases) {
      const q = parseFloat(p.q) || 0;
      const t = parseFloat(p.t) || 0;
      if (t <= 0) continue;
      change = cur
      change = psychFormula(change, q, t);
      change = change - cur
    }
    const perPerson = Math.min((cur/2)+change, 12.327);
    total += perPerson * people;
  }
  return Math.max(total, 0);
}

// ─── SPREAD ───────────────────────────────────────────────────────────

function calcSpread() {
  let totalMax = 0, totalMin = 0;

  for (const ev of spreadEvents) {
    const sp          = parseFloat(ev.spread)       || 0;
    const lit         = parseFloat(ev.litrocity)    || 0;
    const initMax     = parseFloat(ev.initRepMax)   || 0;
    const initMin     = parseFloat(ev.initRepMin)   || 0;
    const changeMax   = parseFloat(ev.repChangeMax) || 0;
    const changeMin   = parseFloat(ev.repChangeMin) || 0;

    const maxBegin = initMax + changeMax;
    const minBegin =initMin + changeMin;
    

    // Average multiplier (this is what you want to use)
    const avgMultiplier = ((initMax + initMin) / 2) + (changeMax + changeMin);

    // Raw base values (for reference only)
    const maxBase = lit * sp * (initMax + changeMax);
    const minBase = lit * sp * (initMin + changeMin);

    // FINAL values that get added to the total (with /100)
    const finalMax = (maxBase)/100 ;
    const finalMin = (minBase)/100 ;

    // Update the display INSIDE the event box to show the ACTUAL contribution
    const row = document.getElementById(`spread-event-${ev.id}`);
    if (row) {
      const maxEl = row.querySelector('.event-max-val');
      const minEl = row.querySelector('.event-min-val');
      if (maxEl) maxEl.textContent = finalMax.toFixed(3) + ' L';
      if (minEl) minEl.textContent = finalMin.toFixed(3) + ' L';
    }

    totalMax += finalMax;
    totalMin += finalMin;
  }

  const avg = (totalMax + totalMin) / 2;

  return { max: totalMax, min: totalMin, avg: avg };
}

// ─── MAIN CALCULATE ───────────────────────────────────────────────────

function calculate() {
  const pain   = calcPain();
  const loss   = calcLoss();
  const psych  = calcPsych();
  const spread = calcSpread();
  const total  = pain + loss + psych + spread.avg;

  setText('painResult',  pain.toFixed(6)       + ' L');
  setText('lossResult',  loss.toFixed(6)       + ' L');
  setText('psychResult', psych.toFixed(6)      + ' L');
  setText('spreadMax',   spread.max.toFixed(6) + ' L');
  setText('spreadMin',   spread.min.toFixed(6) + ' L');
  setText('spreadAvg',   spread.avg.toFixed(6) + ' L');
  setText('subtotalResult', (pain + loss + psych).toFixed(6) + ' L');
  setText('finalLoss',   loss.toFixed(6)       + ' L');
  setText('finalPsych',  psych.toFixed(6)      + ' L');
  setText('finalSpread', spread.avg.toFixed(6) + ' L');
  setText('finalTotal',  total.toFixed(6)      + ' L');
  setText('vialTotal',   total.toFixed(3)      + ' L');

  const fillPct = Math.min(Math.max((total / 1250000) * 100, 0), 100);
  document.getElementById('vialFill').style.width = fillPct + '%';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── PAIN EVENT MANAGEMENT ────────────────────────────────────────────

function addPainEvent() {
  const id = ++painCounter;
  painEvents.push({ id, hours: 0, rank: 0, people: 1 });

  const container = document.getElementById('painEvents');
  const row = document.createElement('div');
  row.className = 'pain-event-row';
  row.id = `pain-event-${id}`;

  row.innerHTML = `
    <div class="pain-event-label">Pain Event ${painEvents.length}</div>
    <div>
      <label>Hours of pain</label>
      <input class="lit-input pain-input" type="number"
        min="0" step="0.01" placeholder="0"
        oninput="updatePainEvent(${id},'hours',this.value)">
    </div>
    <div>
      <label>Pain Rank (0 → 1)</label>
      <div class="slider-row">
        <input class="lit-slider pain-slider" type="range"
          id="pr-s-${id}" min="0" max="1" step="0.00001" value="0"
          oninput="sliderToNum('pr-n-${id}','pr-s-${id}'); updatePainEvent(${id},'rank',this.value)">
        <input class="lit-input pain-input" type="number"
          id="pr-n-${id}" min="0" max="1" step="0.00001" value="0"
          oninput="clampAndSync('pr-n-${id}',0,1,'pr-s-${id}'); updatePainEvent(${id},'rank',this.value)">
      </div>
    </div>
    <div>
      <label>People affected</label>
      <input class="lit-input pain-input" type="number"
        min="1" step="1" placeholder="1"
        oninput="updatePainEvent(${id},'people',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removePainEvent(${id})">✕</button>
  `;

  container.appendChild(row);
}

function updatePainEvent(id, field, value) {
  const ev = painEvents.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removePainEvent(id) {
  painEvents = painEvents.filter(e => e.id !== id);
  document.getElementById(`pain-event-${id}`)?.remove();
  document.querySelectorAll('.pain-event-label').forEach((el, i) => {
    el.textContent = `Pain Event ${i + 1}`;
  });
  calculate();
}

// ─── PSYCH EVENT MANAGEMENT ───────────────────────────────────────────

function addPsychEvent() {
  const id = ++psychCounter;
  psychEvents.push({ id, hours: 0, rank: 0, people: 1, phases: [], phaseCounter: 0 });

  const container = document.getElementById('psychEvents');
  const block = document.createElement('div');
  block.className = 'psych-event-block';
  block.id = `psych-event-${id}`;

  block.innerHTML = `
    <div class="psych-event-header">
      <span class="psych-event-label">Psychological Event ${psychEvents.length}</span>
      <button class="lit-remove-btn" onclick="removePsychEvent(${id})">✕ Remove</button>
    </div>
    <div class="psych-event-inputs">
      <div>
        <label>Psych Rank (0 → 1)</label>
        <div class="slider-row">
          <input class="lit-slider psych-slider" type="range"
            id="psr-s-${id}" min="0" max="1" step="0.01" value="0"
            oninput="sliderToNum('psr-n-${id}','psr-s-${id}'); updatePsychEvent(${id},'rank',this.value)">
          <input class="lit-input lit-input-sm psych-input" type="number"
            id="psr-n-${id}" min="0" max="1" step="0.01" value="0"
            oninput="clampAndSync('psr-n-${id}',0,1,'psr-s-${id}'); updatePsychEvent(${id},'rank',this.value)">
        </div>
      </div>
      <div>
        <label>People affected</label>
        <input class="lit-input psych-input" type="number"
          min="1" step="1" placeholder="1"
          oninput="updatePsychEvent(${id},'people',this.value)">
      </div>
    </div>
    <div class="psych-phases-container" id="psych-phases-${id}"></div>
    <button class="lit-add-btn psych-add-btn" onclick="addPsychPhase(${id})" style="margin:8px 0 0;">+ Add Phase</button>
  `;

  container.appendChild(block);
}

function updatePsychEvent(id, field, value) {
  const ev = psychEvents.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removePsychEvent(id) {
  psychEvents = psychEvents.filter(e => e.id !== id);
  document.getElementById(`psych-event-${id}`)?.remove();
  document.querySelectorAll('.psych-event-label').forEach((el, i) => {
    el.textContent = `Psychological Event ${i + 1}`;
  });
  calculate();
}

function addPsychPhase(evId) {
  const ev = psychEvents.find(e => e.id === evId);
  if (!ev) return;
  const phaseId = ++ev.phaseCounter;
  ev.phases.push({ id: phaseId, q: 0, t: 0 });

  const container = document.getElementById(`psych-phases-${evId}`);
  const row = document.createElement('div');
  row.className = 'psych-phase-row';
  row.id = `psych-phase-${evId}-${phaseId}`;

  row.innerHTML = `
    <div class="psych-phase-label">Phase ${ev.phases.length}</div>
    <div>
      <label>Quality of Life (q)</label>
      <div class="slider-row">
        <input class="lit-slider psych-slider" type="range"
          id="q-s-${evId}-${phaseId}" min="-1.6" max="1.6" step="0.01" value="0"
          oninput="sliderToNum('q-n-${evId}-${phaseId}','q-s-${evId}-${phaseId}'); updatePsychPhase(${evId},${phaseId},'q',this.value)">
        <input class="lit-input lit-input-sm psych-input" type="number"
          id="q-n-${evId}-${phaseId}" min="-1.6" max="1.6" step="0.01" value="0"
          oninput="clampAndSync('q-n-${evId}-${phaseId}',-1.6,1.6,'q-s-${evId}-${phaseId}'); updatePsychPhase(${evId},${phaseId},'q',this.value)">
      </div>
    </div>
    <div>
      <label>Duration (days)</label>
      <input class="lit-input psych-input" type="number"
        min="0" step="1" placeholder="0"
        oninput="updatePsychPhase(${evId},${phaseId},'t',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removePsychPhase(${evId},${phaseId})">✕</button>
  `;

  container.appendChild(row);
}

function updatePsychPhase(evId, phaseId, field, value) {
  const ev = psychEvents.find(e => e.id === evId);
  if (!ev) return;
  const phase = ev.phases.find(p => p.id === phaseId);
  if (phase) { phase[field] = parseFloat(value) || 0; calculate(); }
}

function removePsychPhase(evId, phaseId) {
  const ev = psychEvents.find(e => e.id === evId);
  if (!ev) return;
  ev.phases = ev.phases.filter(p => p.id !== phaseId);
  document.getElementById(`psych-phase-${evId}-${phaseId}`)?.remove();
  const container = document.getElementById(`psych-phases-${evId}`);
  container.querySelectorAll('.psych-phase-label').forEach((el, i) => {
    el.textContent = `Phase ${i + 1}`;
  });
  calculate();
}

// ─── ADDITIONAL LOSS EVENT MANAGEMENT ────────────────────────────────

function addAdditionalLoss() {
  const id = ++addLossCounter;
  additionalLosses.push({ id, rank: 0, amount: 0 });

  const container = document.getElementById('additionalLossEvents');
  const row = document.createElement('div');
  row.className = 'addloss-event-row';
  row.id = `addloss-event-${id}`;

  row.innerHTML = `
    <div class="addloss-event-label">Additional Loss ${additionalLosses.length}</div>
    
    <div>
    <label>Value rank (0 → 1 = one life)</label>
      <div class="slider-row">
        <input class="lit-slider loss-slider" type="range"
          id="al-s-${id}" min="0" max="1" step="0.00001" value="0"
          oninput="sliderToNum('al-n-${id}','al-s-${id}'); updateAdditionalLoss(${id},'rank',this.value)">
        <input class="lit-input loss-input" type="number"
          id="al-n-${id}" min="0" max="1" step="0.00001" value="0"
          oninput="clampAndSync('al-n-${id}',0,01,'al-s-${id}'); updateAdditionalLoss(${id},'rank',this.value)">
      </div>
    </div>
    <div>
      <label>Amount lost</label>
      <input class="lit-input loss-input" type="number"
        min="0" step="1" placeholder="0"
        oninput="updateAdditionalLoss(${id},'amount',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removeAdditionalLoss(${id})">✕</button>
  `;

  container.appendChild(row);
}

function updateAdditionalLoss(id, field, value) {
  const ev = additionalLosses.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removeAdditionalLoss(id) {
  additionalLosses = additionalLosses.filter(e => e.id !== id);
  document.getElementById(`addloss-event-${id}`)?.remove();
  document.querySelectorAll('.addloss-event-label').forEach((el, i) => {
    el.textContent = `Additional Loss ${i + 1}`;
  });
  calculate();

  
}

// ─── FREEDOM LOSS EVENT MANAGEMENT ────────────────────────────────
function addFreedomLossEntry() {
  const id = ++freedomCounter;
  freedomLosses.push({ id, days: 0 });

  const container = document.getElementById('freedomLossEvents');
  const row = document.createElement('div');
  row.className = 'addloss-event-row';
  row.id = `freedom-loss-event-${id}`;

  row.innerHTML = `
    <div class="addloss-event-label">Freedom Loss ${freedomLosses.length}</div>
    <div>
      <label>Days of Freedom Lost <span class="lit-range">days</span></label>
      <input class="lit-input loss-input" type="number"
        min="0" step="1" placeholder="0"
        oninput="updateFreedomLoss(${id},'days',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removeFreedomLoss(${id})">✕</button>
  `;
  container.appendChild(row);
  calculate();
}

function updateFreedomLoss(id, field, value) {
  const ev = freedomLosses.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removeFreedomLoss(id) {
  freedomLosses = freedomLosses.filter(e => e.id !== id);
  document.getElementById(`freedom-loss-event-${id}`)?.remove();
  document.querySelectorAll('#freedomLossEvents .addloss-event-label').forEach((el, i) => {
    el.textContent = `Freedom Loss ${i + 1}`;
  });
  calculate();
}

// ─── LETHAL LOSS EVENT MANAGEMENT ────────────────────────────────
function addLethalLossEntry() {
  const id = ++lethalCounter;
  lethalLosses.push({ id, lives: 0 });

  const container = document.getElementById('lethalLossEvents');
  const row = document.createElement('div');
  row.className = 'addloss-event-row';
  row.id = `lethal-loss-event-${id}`;

  row.innerHTML = `
    <div class="addloss-event-label">Lethal Loss ${lethalLosses.length}</div>
    <div>
      <label>Lives Lost</label>
      <input class="lit-input loss-input" type="number"
        min="0" step="1" placeholder="0"
        oninput="updateLethalLoss(${id},'lives',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removeLethalLoss(${id})">✕</button>
  `;
  container.appendChild(row);
  calculate();
}

function updateLethalLoss(id, field, value) {
  const ev = lethalLosses.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removeLethalLoss(id) {
  lethalLosses = lethalLosses.filter(e => e.id !== id);
  document.getElementById(`lethal-loss-event-${id}`)?.remove();
  document.querySelectorAll('#lethalLossEvents .addloss-event-label').forEach((el, i) => {
    el.textContent = `Lethal Loss ${i + 1}`;
  });
  calculate();
}

// ─── ENTHALPIC LOSS EVENT MANAGEMENT ────────────────────────────────
function addEnthalpicLossEntry() {
  const id = ++enthalpicCounter;
  enthalpicLosses.push({ id, mj: 0 });

  const container = document.getElementById('enthalpicLossEvents');
  const row = document.createElement('div');
  row.className = 'addloss-event-row';
  row.id = `enthalpic-loss-event-${id}`;

  row.innerHTML = `
    <div class="addloss-event-label">Enthalpic Loss ${enthalpicLosses.length}</div>
    <div>
      <label>Energy Wasted <span class="lit-range">MJ</span></label>
      <input class="lit-input loss-input" type="number"
        min="0" step="0.01" placeholder="0"
        oninput="updateEnthalpicLoss(${id},'mj',this.value)">
    </div>
    <button class="lit-remove-btn" onclick="removeEnthalpicLoss(${id})">✕</button>
  `;
  container.appendChild(row);
  calculate();
}

function updateEnthalpicLoss(id, field, value) {
  const ev = enthalpicLosses.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removeEnthalpicLoss(id) {
  enthalpicLosses = enthalpicLosses.filter(e => e.id !== id);
  document.getElementById(`enthalpic-loss-event-${id}`)?.remove();
  document.querySelectorAll('#enthalpicLossEvents .addloss-event-label').forEach((el, i) => {
    el.textContent = `Enthalpic Loss ${i + 1}`;
  });
  calculate();
}

// ─── SPREAD EVENT MANAGEMENT ──────────────────────────────────────────

function addSpreadEvent() {
  const id = ++eventCounter;
  spreadEvents.push({ id, spread: 0, litrocity: 0, initRepMax: 0, initRepMin: 0, repChangeMax: 0, repChangeMin: 0 });

  const container = document.getElementById('spreadEvents');
  const row = document.createElement('div');
  row.className = 'spread-event-row';
  row.id = `spread-event-${id}`;

  row.innerHTML = `
    <div class="spread-event-title">
      Event ${spreadEvents.length}
      <button class="lit-remove-btn" onclick="removeSpreadEvent(${id})">✕ Remove</button>
    </div>
    <div class="spread-event-grid">
      <div>
        <label>Spread (# people / occurrences)</label>
        <input class="lit-input spread-input" type="number"
          min="0" step="1" placeholder="0"
          oninput="updateSpreadEvent(${id},'spread',this.value)">
      </div>
      <div>
        <label>Litrocity of Event (L)</label>
        <input class="lit-input spread-input" type="number"
          min="0" step="0.001" placeholder="0"
          oninput="updateSpreadEvent(${id},'litrocity',this.value)">
      </div>
      <div>
        <label>Initial Repeatance Chance MAX (−1 → 1)</label>
        <div class="slider-row">
          <input class="lit-slider spread-slider" type="range"
            id="irmax-s-${id}" min="0" max="1" step="0.01" value="0"
            oninput="sliderToNum('irmax-n-${id}','irmax-s-${id}'); updateSpreadEvent(${id},'initRepMax',this.value)">
          <input class="lit-input lit-input-sm spread-input" type="number"
            id="irmax-n-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="clampAndSync('irmax-n-${id}',-1,1,'irmax-s-${id}'); updateSpreadEvent(${id},'initRepMax',this.value)">
        </div>
      </div>
      <div>
        <label>Initial Repeatance Chance MIN (−1 → 1)</label>
        <div class="slider-row">
          <input class="lit-slider spread-slider" type="range"
            id="irmin-s-${id}" min="0" max="1" step="0.01" value="0"
            oninput="sliderToNum('irmin-n-${id}','irmin-s-${id}'); updateSpreadEvent(${id},'initRepMin',this.value)">
          <input class="lit-input lit-input-sm spread-input" type="number"
            id="irmin-n-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="clampAndSync('irmin-n-${id}',-1,1,'irmin-s-${id}'); updateSpreadEvent(${id},'initRepMin',this.value)">
        </div>
      </div>
      <div>
        <label>Repeatance Chance Change MAX (−1 → 1)</label>
        <div class="slider-row">
          <input class="lit-slider spread-slider" type="range"
            id="rcmax-s-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="sliderToNum('rcmax-n-${id}','rcmax-s-${id}'); updateSpreadEvent(${id},'repChangeMax',this.value)">
          <input class="lit-input lit-input-sm spread-input" type="number"
            id="rcmax-n-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="clampAndSync('rcmax-n-${id}',-1,1,'rcmax-s-${id}'); updateSpreadEvent(${id},'repChangeMax',this.value)">
        </div>
      </div>
      <div>
        <label>Repeatance Chance Change MIN (−1 → 1)</label>
        <div class="slider-row">
          <input class="lit-slider spread-slider" type="range"
            id="rcmin-s-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="sliderToNum('rcmin-n-${id}','rcmin-s-${id}'); updateSpreadEvent(${id},'repChangeMin',this.value)">
          <input class="lit-input lit-input-sm spread-input" type="number"
            id="rcmin-n-${id}" min="-1" max="1" step="0.01" value="0"
            oninput="clampAndSync('rcmin-n-${id}',-1,1,'rcmin-s-${id}'); updateSpreadEvent(${id},'repChangeMin',this.value)">
        </div>
      </div>
    </div>
    <div class="spread-event-results">
      <span>MAX: <b class="event-max-val">—</b></span>
      <span>MIN: <b class="event-min-val">—</b></span>
    </div>
  `;

  container.appendChild(row);
}

function updateSpreadEvent(id, field, value) {
  const ev = spreadEvents.find(e => e.id === id);
  if (ev) { ev[field] = parseFloat(value) || 0; calculate(); }
}

function removeSpreadEvent(id) {
  spreadEvents = spreadEvents.filter(e => e.id !== id);
  document.getElementById(`spread-event-${id}`)?.remove();
  document.querySelectorAll('.spread-event-title').forEach((el, i) => {
    const btn = el.querySelector('button');
    el.textContent = `Event ${i + 1}`;
    if (btn) el.appendChild(btn);
  });
  calculate();
}

function toggleLoss(sectionId, btn) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const isHidden = el.style.display === 'none';
  el.style.display = isHidden ? '' : 'none';
  if (btn) {
    const label = btn.textContent.replace(/^[+−] /, '');
    btn.textContent = (isHidden ? '− ' : '+ ') + label;
  }
}

// ─── PDF REPORT GENERATOR ─────────────────────────────────────────────
// ─── PDF REPORT GENERATOR (High-Level + Detailed Events) ─────────────
function generateLitrocityReport() {
  const eventName = prompt("Name event!", "Untitled Event");
  if (eventName === null) return; // user clicked Cancel

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  // ── TITLE ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("LITROUS ATROCITY REPORT", 105, y, { align: "center" });
  y += 12;
  doc.setFontSize(16);
  doc.text(eventName, 105, y, { align: "center" });
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
  y += 25;

  // ── 1. PHYSICAL PAIN ──
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("1. PHYSICAL PAIN", 20, y);
  y += 12;
  doc.setFontSize(13);
  doc.text(`Total: ${document.getElementById('painResult').textContent}`, 20, y);
  y += 15;

  painEvents.forEach((ev, i) => {
    const hours = parseFloat(ev.hours) || 0;
    const rank = parseFloat(ev.rank) || 0;
    const people = parseFloat(ev.people) || 1;
    const contrib = hours * Math.pow(rank, 2) * FAINT_LITRES_PER_HOUR * people;
    doc.setFontSize(11);
    doc.text(`Event ${i+1}: ${hours} hrs × rank²(${rank.toFixed(3)}) × ${people} people = ${contrib.toFixed(6)} L`, 25, y);
    y += 9;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  y += 12;

  // ── 2. PSYCHOLOGICAL ──
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("2. PSYCHOLOGICAL DAMAGE", 20, y);
  y += 12;
  doc.setFontSize(13);
  doc.text(`Total: ${document.getElementById('psychResult').textContent}`, 20, y);
  y += 15;

  psychEvents.forEach((ev, i) => {
    const rank = parseFloat(ev.rank) || 0;
    const people = parseFloat(ev.people) || 1;
    let cur = rank * BABY_LITROCITY;   // initial
    doc.setFontSize(11);
    doc.text(`Event ${i+1}: Rank ${rank.toFixed(3)} × ${people} people`, 25, y);
    y += 9;

    // phases
    ev.phases.forEach((phase, p) => {
      const q = parseFloat(phase.q) || 0;
      const t = parseFloat(phase.t) || 0;
      if (t > 0) {
        doc.text(`   Phase ${p+1}: q = ${q.toFixed(2)}, ${t} days`, 35, y);
        y += 8;
      }
    });

    // final per-person value (re-using the same logic as calcPsych)
    let finalPerPerson = rank * BABY_LITROCITY;
    ev.phases.forEach(phase => {
      const q = parseFloat(phase.q) || 0;
      const t = parseFloat(phase.t) || 0;
      if (t > 0) finalPerPerson = psychFormula(finalPerPerson, q, t);
    });
    finalPerPerson = Math.min(finalPerPerson, 12.327);

    doc.text(`   → Final per person: ${finalPerPerson.toFixed(6)} L × ${people} = ${(finalPerPerson * people).toFixed(6)} L`, 35, y);
    y += 12;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  y += 12;

  // ── 3. LOSS ──
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("3. LOSS", 20, y);
  y += 12;
  doc.setFontSize(13);
  doc.text(`Total: ${document.getElementById('lossResult').textContent}`, 20, y);
  y += 15;

  // Freedom
  freedomLosses.forEach((ev, i) => {
    const days = parseFloat(ev.days) || 0;
    const val = days * ML_PER_FREEDOM_DAY / 1000;
    doc.setFontSize(11);
    doc.text(`Freedom Loss ${i+1}: ${days} days = ${val.toFixed(6)} L`, 25, y);
    y += 9;
  });
  // Lethal
  lethalLosses.forEach((ev, i) => {
    const lives = parseFloat(ev.lives) || 0;
    const val = lives * BABY_LITROCITY;
    doc.text(`Lethal Loss ${i+1}: ${lives} lives = ${val.toFixed(6)} L`, 25, y);
    y += 9;
  });
  // Enthalpic
  enthalpicLosses.forEach((ev, i) => {
    const mj = parseFloat(ev.mj) || 0;
    const val = mj / MJ_PER_LITRE;
    doc.text(`Enthalpic Loss ${i+1}: ${mj} MJ = ${val.toFixed(6)} L`, 25, y);
    y += 9;
  });
  // Other
  additionalLosses.forEach((ev, i) => {
    const rank = parseFloat(ev.rank) || 0;
    const amount = parseFloat(ev.amount) || 0;
    const val = rank * BABY_LITROCITY * amount;
    doc.text(`Other Loss ${i+1}: rank ${rank.toFixed(3)} × ${amount} = ${val.toFixed(6)} L`, 25, y);
    y += 9;
  });
  y += 12;

  // ── 4. SPREAD ──
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("4. SPREAD DREAD", 20, y);
  y += 12;
  doc.setFontSize(13);
  doc.text(`MAX: ${document.getElementById('spreadMax').textContent}`, 20, y);
  y += 9;
  doc.text(`MIN: ${document.getElementById('spreadMin').textContent}`, 20, y);
  y += 9;
  doc.text(`Average (used in total): ${document.getElementById('spreadAvg').textContent}`, 20, y);
  y += 18;

  spreadEvents.forEach((ev, i) => {
    const lit = parseFloat(ev.litrocity) || 0;
    const sp = parseFloat(ev.spread) || 0;
    const iMax = parseFloat(ev.initRepMax) || 0;
    const iMin = parseFloat(ev.initRepMin) || 0;
    const cMax = parseFloat(ev.repChangeMax) || 0;
    const cMin = parseFloat(ev.repChangeMin) || 0;
    const avgMult = ((iMax + iMin) / 2) + ((cMax + cMin) / 2);

    const contrib = (lit * sp * avgMult) / 100;

    doc.setFontSize(11);
    doc.text(`Event ${i+1}: ${lit.toFixed(6)} L × ${sp} × avg multiplier ${avgMult.toFixed(3)} / 100 = ${contrib.toFixed(6)} L`, 25, y);
    y += 12;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  // ── FINAL TOTAL ──
  y += 10;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("FINAL TOTAL LITROCITY", 20, y);
  y += 15;
  doc.setFontSize(26);
  doc.text(document.getElementById('finalTotal').textContent, 20, y);

  // Save
  doc.save(`Litrous_Atrocity_${eventName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}