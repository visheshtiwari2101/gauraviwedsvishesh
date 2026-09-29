import {wedding as w,content} from './config.js';
import {countdownParts,validateRsvp,sendRsvp} from './services.js';
import {createInvitationMotion} from './motion.js';
import {mountGarden} from './world.js';
import {createMusicPlayback} from './music.js';
let language='en',entered=false,formState='idle',player,musicPlaying=false;
const main=document.querySelector('main'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=key=>content[language][key];
const copy=(key,tag='p',cls='')=>`<${tag} class="${cls}" data-copy="${key}">${escape(t(key))}</${tag}>`;
const names=()=>`${w.couple[language][0]} <span>${language==='hi'?'संग':'&'}</span> ${w.couple[language][1]}`;
const official=key=>`<div class="official ${key}"><img src="${w.assets[key]}" alt="${key==='ganesha'?'Lord Ganesha':'Official Vishesh and Gauravi wedding monogram'}" width="${key==='ganesha'?365:1024}" height="${key==='ganesha'?354:1024}" loading="lazy"></div>`;
document.querySelectorAll('[data-official]').forEach(slot=>{const key=slot.dataset.official;slot.innerHTML=`<img src="${w.assets[key]}" alt="${key==='ganesha'?'Lord Ganesha':'Official Vishesh and Gauravi wedding monogram'}" width="${key==='ganesha'?365:1024}" height="${key==='ganesha'?354:1024}">`;});
function familyMarkup(f,index) {
 return `<article class="family"><div class="family-blessings" data-reveal="up">${copy('familyBlessings','p','host-invitation')}<p class="grandparents" data-grandparents="${index}">${f.grandparents[language].map((name,i)=>`<span>${escape(name)}${i===0?(language==='hi'?' एवं':' &amp;'):''}</span>`).join('')}</p></div>${copy('familyHosts','p','parents')}${copy('familyRequest','p','host-invitation')}<h3 class="family-name" data-couple="1" data-reveal="scale">${w.couple[language][1]}</h3>${copy('brideParents','p','host-invitation')}${copy('union','p','host-invitation')}<h3 class="family-name" data-couple="0" data-reveal="scale">${w.couple[language][0]}</h3>${copy('groomParents','p','host-invitation')}</article>`;
}
function dayMarkup(index) {
 return `<div class="programme-day" id="day-${index+1}"><header class="day-heading"><p class="day-date" data-reveal="left"><span>${Number(w.dates[index].slice(8))}</span> <span data-month>${t('month')}</span> <span>${w.dates[index].slice(0,4)}</span></p><h3 data-day-title="${index}" data-reveal="mask">${t('dayTitles')[index]}</h3></header><ol>${w.events.map((e,i)=>e.date===index?`<li class="event"><span class="event-marker" aria-hidden="true">✧</span><div class="ceremony-art" data-reveal="scale" aria-hidden="true"><div class="ceremony-sway" data-ambient="ceremony-${i}"><img class="ceremony-sprite ceremony-${i}" src="./assets/ceremonies.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async"></div></div><div class="event-copy"><p class="event-time" data-reveal="left">${e.time}</p><h3 data-event="${i}" data-reveal="mask">${e.name[language]}</h3><p data-event-note="${i}" data-reveal="right">${e.note[language]}</p></div></li>`:'').join('')}</ol></div>`;
}
main.innerHTML=`<div class="journey">
<section class="hero scene" id="hero" aria-labelledby="hero-title"><div class="hero-landscape" data-depth=".055" aria-hidden="true"></div><div class="botanical hero-bough" data-depth="-.05" aria-hidden="true"></div><div class="hero-copy">${official('ganesha')}<div class="ganesha-prayer" lang="sa"><p class="devotional">श्री गणेशाय नमः</p><p class="ganesha-shloka">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p></div>${copy('heroIntro','p','invitation-intro')}<h2 class="names" id="hero-title" data-names>${names()}</h2><div class="ornament" aria-hidden="true">✧</div>${copy('dateRange','p','ceremonial hero-date')}<p class="venue-inline" data-venue-inline>${w.venue[language]}, ${w.city[language]}</p><p class="hashtag">${w.hashtag}</p>${copy('heroEnd','p','hero-end')}<a href="#families" class="scroll-cue">${copy('scroll','span')}<span aria-hidden="true">↓</span></a></div></section>
<section class="families scene" id="families" aria-labelledby="family-title"><header>${copy('familyKicker','p','eyebrow')}<h2 class="section-title" id="family-title" data-copy="familyTitle">${t('familyTitle')}</h2>${copy('familyIntro','p','intro')}</header><div class="family-columns">${w.families.map(familyMarkup).join('')}<div class="family-flourish" aria-hidden="true"><img src="./assets/meadow.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async"></div></div>${copy('familyEnd','p','family-end ceremonial')}<div class="botanical family-bough" data-depth=".07" aria-hidden="true"></div></section>
<section class="programme scene" id="programme" aria-labelledby="programme-title"><header>${copy('programmeKicker','p','eyebrow')}<h2 class="section-title" id="programme-title" data-copy="programmeTitle">${t('programmeTitle')}</h2></header><div class="timeline"><div class="timeline-line" aria-hidden="true"><span></span></div>${dayMarkup(0)}${dayMarkup(1)}</div></section>
<section class="countdown scene" id="countdown" aria-labelledby="countdown-title">${copy('countdownKicker','p','eyebrow')}<h2 class="section-title" id="countdown-title" data-copy="countdownTitle">${t('countdownTitle')}</h2><div class="countdown-line" role="timer" aria-live="off">${[0,1,2,3].map((_,i)=>`${i?'<span class="countdown-dot" aria-hidden="true">·</span>':''}<span class="countdown-part"><strong data-count="${i}">00</strong><span data-count-label="${i}">${t('countdownLabels')[i]}</span></span>`).join('')}</div><p class="countdown-target" data-countdown-date></p><p data-copy="countdownEnd" id="countdown-ended" hidden>${t('countdownEnd')}</p></section>
<section class="venue scene" id="venue" aria-labelledby="venue-title"><div class="venue-art" data-depth=".04" aria-hidden="true"></div><div class="venue-content">${copy('venueKicker','p','eyebrow')}<h2 id="venue-title" data-venue>${w.venue[language]}</h2><p class="venue-city ceremonial" data-city>${w.city[language]}</p><p class="venue-address" data-address>${w.address[language]}</p><div class="ornament" aria-hidden="true">✧</div>${copy('venueNote','p','venue-note')}<a class="text-link" href="${w.directionsUrl}" target="_blank" rel="noopener noreferrer"><span data-copy="directions">${t('directions')}</span><span aria-hidden="true">↗</span></a></div></section>
<section class="rsvp scene" id="rsvp" aria-labelledby="rsvp-title"><header>${copy('rsvpKicker','p','eyebrow')}<h2 id="rsvp-title" class="section-title" data-copy="rsvpTitle">${t('rsvpTitle')}</h2>${copy('rsvpIntro','p','intro')}</header><form id="rsvp-form" novalidate><div class="field"><label for="guest-name" data-copy="name">${t('name')}</label><input id="guest-name" name="name" autocomplete="name" required maxlength="120"></div><fieldset class="attendance-field"><legend data-copy="attendance">${t('attendance')}</legend><div class="attendance-choices"><label class="attendance-choice"><input type="radio" name="attendance" value="yes" required><span class="choice-mark" aria-hidden="true"></span><span data-copy="yes">${t('yes')}</span></label><label class="attendance-choice"><input type="radio" name="attendance" value="no" required><span class="choice-mark" aria-hidden="true"></span><span data-copy="no">${t('no')}</span></label></div></fieldset><div class="field guest-field"><label for="guests" data-copy="guests">${t('guests')}</label><div class="guest-stepper"><button type="button" data-step="-1" aria-label="${t('decreaseGuests')}">−</button><input id="guests" name="guests" type="number" min="1" max="100" step="1" value="1" inputmode="numeric" required><button type="button" data-step="1" aria-label="${t('increaseGuests')}">+</button></div></div><div class="field"><label for="message"><span data-copy="message">${t('message')}</span> <span class="optional" data-copy="optional">${t('optional')}</span></label><textarea id="message" name="message" rows="3" maxlength="2000"></textarea></div><button class="primary-button" id="submit-rsvp" type="submit" data-copy="submit">${t('submit')}</button><p id="form-status" role="status" aria-live="polite" tabindex="-1"></p></form><div class="contacts"><p class="ceremonial" data-copy="contactHeading">${t('contactHeading')}</p>${copy('contactHosts','p','ceremonial contact-hosts')}<div>${w.families.map(f=>`<a href="tel:+91${f.contact}"><strong>+91 ${f.contact}</strong></a>`).join('')}</div></div></section>
<section class="finale scene" id="finale" aria-labelledby="finale-title"><div class="botanical finale-bough" data-depth="-.025" aria-hidden="true"></div><div class="finale-content">${copy('finaleKicker','p','eyebrow')}${official('monogram')}<h2 id="finale-title"><span data-couple="0">${w.couple[language][0]}</span><em data-copy="weds">${t('weds')}</em><span data-couple="1">${w.couple[language][1]}</span></h2>${copy('dateRange','p','finale-date')}<p data-venue-inline>${w.venue[language]}, ${w.city[language]}</p><p class="hashtag">${w.hashtag}</p><div class="ornament" aria-hidden="true">✧</div>${copy('finaleLove','p','finale-love')}</div></section></div>`;

// Help follows the final invitation, with the same translated contact nodes.
const help=document.createElement('section');
help.className='help scene';help.id='help';help.setAttribute('aria-label','Family contacts');
help.append(document.querySelector('.contacts'));
main.querySelector('.journey').append(help);
const updateAtmosphere=mountGarden(main);
for(const selector of ['.hero-copy>.eyebrow','.invitation-intro','.hero-date','.venue-inline','.hero-end','.invocation .devotional','.invocation .section-title','.blessing','.families header>*','.family-end','.programme>header>*','.countdown>.eyebrow','.countdown .section-title','.countdown-target','.venue-content>*','.rsvp header>*','.finale-content>.eyebrow','.finale-date','.finale-content>[data-venue-inline]','.finale-love','.finale-families']) {
 document.querySelectorAll(selector).forEach((el,i)=>el.dataset.reveal=i%2?'right':'mask');
}
main.querySelectorAll('.names,#finale-title>span').forEach(el=>el.dataset.reveal='scale');
document.querySelector('.countdown-line').dataset.reveal='scale';
// Enhance intact text blocks rather than replacing translated text with letters.
main.querySelectorAll('p,h2,h3,.official,.ornament,.field,.attendance-field,.contacts a,.text-link').forEach((el,i)=>{
 if(el.id==='form-status'||el.hidden||el.closest('form')&&!el.matches('.field,.attendance-field'))return;
 if(el.parentElement.closest('[data-reveal]')||el.querySelector('[data-reveal]'))return;
 if(!el.dataset.reveal)el.dataset.reveal=el.matches('.official,h2,h3')?'scale':['up','fade','left','up'][i%4];
 el.dataset.revealDelay=String(i%3*55);
});
main.querySelectorAll('[data-parent-name]').forEach((el,i)=>{el.dataset.reveal='up';el.dataset.revealDelay=String(i%2*110);});
main.querySelectorAll('[data-reveal]').forEach(el=>{if(['left','right','mask'].includes(el.dataset.reveal))el.dataset.reveal='up';});
const motion=createInvitationMotion(main,reducedMotion,updateAtmosphere);

const form=document.querySelector('#rsvp-form'),status=document.querySelector('#form-status');
function updateStatus(){const keys={submitting:'submitting',success:'success',error:'error',invalid:'validation'};status.textContent=keys[formState]?t(keys[formState]):'';status.className=formState;const b=document.querySelector('#submit-rsvp');b.textContent=t(formState==='submitting'?'submitting':'submit');b.disabled=formState==='submitting'||formState==='success';form.setAttribute('aria-busy',String(formState==='submitting'));}
function setLanguage(next){
 if(!content[next])return;const anchor=[...main.querySelectorAll('h2,h3,.field,.event-time,.parents,.grandparents')].find(s=>s.getBoundingClientRect().bottom>innerHeight*.2),offset=anchor?.getBoundingClientRect().top;
 language=next;document.documentElement.lang=next;
 document.querySelector('.opening-amp').textContent=next==='hi'?'संग':'&';
 document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));document.querySelectorAll('[data-names]').forEach(el=>el.innerHTML=names());
 document.querySelectorAll('[data-couple]').forEach(el=>el.textContent=w.couple[next][Number(el.dataset.couple)]);
 document.querySelectorAll('[data-month]').forEach(el=>el.textContent=t('month'));
 document.querySelectorAll('[data-day-title]').forEach(el=>el.textContent=t('dayTitles')[el.dataset.dayTitle]);
 document.querySelectorAll('[data-event]').forEach(el=>el.textContent=w.events[el.dataset.event].name[next]);document.querySelectorAll('[data-event-note]').forEach(el=>el.textContent=w.events[el.dataset.eventNote].note[next]);
 document.querySelectorAll('[data-venue-inline]').forEach(el=>el.textContent=`${w.venue[next]}, ${w.city[next]}`);document.querySelector('[data-venue]').textContent=w.venue[next];document.querySelector('[data-city]').textContent=w.city[next];document.querySelector('[data-address]').textContent=w.address[next];
 w.families.forEach((f,i)=>{document.querySelector(`[data-grandparents="${i}"]`).innerHTML=f.grandparents[next].map((name,i)=>`<span>${escape(name)}${i===0?(language==='hi'?' एवं':' &amp;'):''}</span>`).join('');});
 document.querySelectorAll('[data-count-label]').forEach(el=>el.textContent=t('countdownLabels')[el.dataset.countLabel]);document.querySelector('[data-countdown-date]').textContent=`${Number(w.dates[1].slice(8))} ${t('month')} ${w.dates[1].slice(0,4)} · ${w.events.at(-1).time} IST`;
 document.querySelectorAll('[data-language]').forEach(el=>el.classList.toggle('active-language',el.dataset.language===next));document.querySelector('.skip-link').textContent=t('skip');document.querySelector('.language-control').setAttribute('aria-label',next==='en'?'Language: English. Switch to Hindi':'भाषा: हिन्दी। अंग्रेज़ी में पढ़ें');document.querySelector('[data-step="-1"]').setAttribute('aria-label',t('decreaseGuests'));document.querySelector('[data-step="1"]').setAttribute('aria-label',t('increaseGuests'));updateStatus();updateMusicControl();
 if(entered&&anchor)requestAnimationFrame(()=>{window.scrollBy({top:anchor.getBoundingClientRect().top-offset,behavior:'instant'});motion.refresh();});
}
function updateCountdown(){const parts=countdownParts(w.countdown);document.querySelectorAll('[data-count]').forEach(el=>el.textContent=String(parts[el.dataset.count]).padStart(2,'0'));document.querySelector('#countdown-ended').hidden=parts.some(Boolean);}
updateCountdown();setInterval(updateCountdown,1000);setLanguage('en');
document.querySelector('.language-control').addEventListener('click',()=>setLanguage(language==='en'?'hi':'en'));
document.querySelectorAll('[data-enter]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.enter)));
document.querySelector('.skip-link').addEventListener('click',e=>{if(!entered){e.preventDefault();enter(language);}});
async function enter(lang,withMedia=true){
 if(entered)return;
 setLanguage(lang);entered=true;
 const opening=document.querySelector('.opening');
 document.body.classList.add('entering');
 opening.inert=true;main.hidden=false;
 window.scrollTo({top:0,behavior:'instant'});
 if(withMedia){music.request();prepareMusic();}
 motion.start();
 if(!reducedMotion.matches){
  const exit=opening.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.025)'}],{duration:720,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
  const entrance=main.animate([{opacity:0},{opacity:1}],{duration:850,easing:'ease-out'});
  const finish=()=>{exit.finish();entrance.finish();};
  reducedMotion.addEventListener('change',finish,{once:true});
  await exit.finished.catch(()=>{});
  reducedMotion.removeEventListener('change',finish);
 }
 document.body.classList.add('entered');document.body.classList.remove('entering');
 document.querySelector('.language-control').hidden=false;document.querySelector('#music-toggle').hidden=false;
 main.focus({preventScroll:true});motion.refresh();
}
let acceptedGuests=1;
const guestInput=document.querySelector('#guests');
function updateGuestControls() {
 const declined=form.querySelector('input[name="attendance"]:checked')?.value==='no';
 const locked=formState==='submitting'||formState==='success';
 guestInput.disabled=declined||locked;
 form.querySelectorAll('[data-step]').forEach(button=>button.disabled=declined||locked||(Number(button.dataset.step)<0?Number(guestInput.value)<=1:Number(guestInput.value)>=100));
}
form.querySelectorAll('input[name="attendance"]').forEach(radio=>radio.addEventListener('change',()=>{
 if(radio.value==='no') {acceptedGuests=Math.max(1,Number(guestInput.value)||1);guestInput.value='0';guestInput.min='0';}
 else {guestInput.value=String(acceptedGuests);guestInput.min='1';}
 updateGuestControls();
}));
form.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
 guestInput.value=String(Math.max(1,Math.min(100,(Number(guestInput.value)||1)+Number(button.dataset.step))));
 acceptedGuests=Number(guestInput.value);updateGuestControls();
}));
form.addEventListener('input',()=>{
 if(formState==='invalid'){formState='idle';updateStatus();}
 document.querySelector('#guest-name').setCustomValidity('');
 form.querySelectorAll('[aria-invalid=true]').forEach(el=>el.removeAttribute('aria-invalid'));
 if(!guestInput.disabled)acceptedGuests=Number(guestInput.value)||1;
 updateGuestControls();
});
function lockForm(locked) {
 form.querySelectorAll('input,textarea,[data-step]').forEach(el=>el.disabled=locked);
 updateGuestControls();
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(formState==='submitting'||formState==='success')return;
 const fields=Object.fromEntries(new FormData(form));fields.guests=fields.attendance==='no'?'0':fields.guests;fields.message=fields.message||'';
 const nameInput=document.querySelector('#guest-name');nameInput.setCustomValidity(fields.name?.trim()?'':t('validation'));
 if(!validateRsvp(fields)||!form.checkValidity()) {
   formState='invalid';updateStatus();form.querySelectorAll('input,textarea').forEach(el=>{if(!el.checkValidity())el.setAttribute('aria-invalid','true');});
   form.reportValidity();return;
 }
 formState='submitting';updateStatus();lockForm(true);
 try{await sendRsvp(w.rsvpEndpoint,fields);formState='success';}catch{formState='error';}
 updateStatus();lockForm(formState==='success');status.focus({preventScroll:true});motion.refresh();
});
updateGuestControls();
function updateMusicControl(){const b=document.querySelector('#music-toggle');b.setAttribute('aria-pressed',String(musicPlaying));b.setAttribute('aria-label',t(musicPlaying?'pauseLabel':'playLabel'));b.dataset.state=musicPlaying?'playing':'paused';}

const music=createMusicPlayback(state=>{musicPlaying=state.playing;updateMusicControl();});
function prepareMusic(){
 if(player)return;
 const createPlayer=()=>{
  if(player)return;
  const videoId=new URL(w.musicUrl).searchParams.get('v');
  const wrap=document.querySelector('#music-player-wrap');wrap.hidden=false;wrap.setAttribute('aria-hidden','true');
  player=new window.YT.Player('music-player',{width:200,height:200,videoId,
   playerVars:{autoplay:0,playsinline:1,loop:1,playlist:videoId,origin:location.origin},
   events:{
    onReady:e=>{const frame=e.target.getIframe?.();if(frame){frame.setAttribute('allow','autoplay; encrypted-media; fullscreen; picture-in-picture');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');frame.tabIndex=-1;}music.ready(e.target);},
    onStateChange:e=>music.state(e.data),
    onAutoplayBlocked:()=>music.blocked(),
    onError:()=>{music.error();document.querySelector('#music-toggle').title=t('musicUnavailable');}
   }});
 };
 if(window.YT?.Player){createPlayer();return;}
 if(document.querySelector('#youtube-api'))return;
 window.onYouTubeIframeAPIReady=createPlayer;
 const script=document.createElement('script');script.id='youtube-api';script.src='https://www.youtube.com/iframe_api';script.async=true;
 script.onerror=()=>{script.remove();music.error();};document.head.append(script);
}
document.querySelector('#music-toggle').addEventListener('click',()=>{music.toggle();prepareMusic();});
function musicGesture(event){
 if(!event.isTrusted||event.target.closest?.('#music-toggle'))return;
 if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
 music.gesture();prepareMusic();
}
document.addEventListener('pointerup',musicGesture,{passive:true});
document.addEventListener('keydown',musicGesture);
// Prepare silently so the first tap can call playVideo synchronously.
prepareMusic();
