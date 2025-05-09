/* Simon Game – v7 with suspense music */
const order=[], pads=['green','red','yellow','blue'];
let playing=false, step=0, level=0;

const scoreSpan=document.getElementById('score');
const overlay=document.getElementById('overlay');
const finalScore=document.getElementById('finalScore');
const countdownEl=document.getElementById('countdown');
const countNum=document.getElementById('countNum');
const startBtn=document.getElementById('startBtn');
const timerSpan=document.getElementById('timer');
const bgm=document.getElementById('bgm');

/* Stopwatch */
let startTime=0, stopwatchInt=null;
function formatTime(ms){const c=Math.floor(ms/10),cent=c%100,sec=Math.floor(c/100)%60,min=Math.floor(c/6000);return`${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(cent).padStart(2,'0')}`;}
function startStopwatch(){startTime=performance.now();stopwatchInt=setInterval(()=>{timerSpan.textContent=formatTime(performance.now()-startTime);},10);}
function stopStopwatch(){clearInterval(stopwatchInt);}

/* Audio tones */
const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
const freqs={green:164.81,red:220,yellow:277.18,blue:329.63};
function beep(f,d=380){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='square';o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);const n=audioCtx.currentTime;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(.25,n+.01);g.gain.linearRampToValueAtTime(.22,n+d/1000*.7);g.gain.exponentialRampToValueAtTime(.0001,n+d/1000);o.start(n);o.stop(n+d/1000+.05);}

/* Flash */
function flash(c){const el=document.getElementById(c);el.classList.add('lit');beep(freqs[c]);setTimeout(()=>el.classList.remove('lit'),300);}

/* Sequence */
function playSequence(){playing=false;let i=0;const inter=setInterval(()=>{flash(order[i]);i++;if(i>=order.length){clearInterval(inter);playing=true;}},Math.max(650-level*25,300));}

/* Progress */
function nextRound(){level++;scoreSpan.textContent=level;order.push(pads[Math.floor(Math.random()*4)]);step=0;playSequence();}

/* Game Over */
function gameOver(){playing=false;stopStopwatch();bgm.pause();bgm.currentTime=0;finalScore.textContent=level;overlay.classList.remove('hidden');}

/* Countdown */
function startCountdown(cb){let c=3;countNum.textContent=c;countdownEl.classList.remove('hidden');const t=setInterval(()=>{c--;if(c===0){clearInterval(t);countdownEl.classList.add('hidden');startStopwatch();cb();}else{countNum.textContent=c;}},1000);}

/* Start Game */
function startGame(){order.length=0;level=0;scoreSpan.textContent=0;timerSpan.textContent='00:00.00';overlay.classList.add('hidden');bgm.currentTime=0;bgm.play();startCountdown(nextRound);}

/* Listeners */
pads.forEach(c=>document.getElementById(c).addEventListener('click',()=>{if(!playing)return;flash(c);if(c===order[step]){step++;if(step===order.length)setTimeout(nextRound,750);}else gameOver();}));
startBtn.addEventListener('click',()=>{if(audioCtx.state==='suspended')audioCtx.resume();startGame();});
