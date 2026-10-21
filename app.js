/* menu mobilne */
(function(){
  const h=document.querySelector('.ham'),p=document.getElementById('panel'); if(!h||!p)return;
  const ustaw=o=>{h.setAttribute('aria-expanded',o);p.classList.toggle('otwarte',o);document.body.style.overflow=o?'hidden':''};
  h.addEventListener('click',()=>ustaw(h.getAttribute('aria-expanded')!=='true'));
  p.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>ustaw(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')ustaw(false)});
  matchMedia('(min-width:1061px)').addEventListener('change',e=>{if(e.matches)ustaw(false)});
})();

/* dolny pasek: dopiero po przewinieciu za przycisk w hero */
(function(){
  const m=document.querySelector('.mob'),c=document.querySelector('.hero-cta'); if(!m||!c||!('IntersectionObserver' in window))return;
  new IntersectionObserver(([e])=>m.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(c);
})();

/* szybkie zapytanie */
(function(){
  const $=id=>document.getElementById(id);
  const U={
    nowa:{n:'Nowa instalacja elektryczna',par:'m2',lista:['rzut lub szkic mieszkania / domu (zdjęcie z telefonu wystarczy)','orientacyjna liczba gniazd, punktów świetlnych i obwodów','czy przewidujesz płytę indukcyjną, pompę ciepła, ładowarkę auta']},
    moder:{n:'Wymiana / modernizacja instalacji',par:'m2',lista:['rok budowy budynku i rodzaj przewodów (aluminium / miedź), jeśli wiesz','zdjęcie obecnej rozdzielnicy lub tablicy bezpiecznikowej','czy lokal będzie zamieszkany w trakcie prac']},
    awaria:{n:'Usterka lub awaria',par:null,lista:['co dokładnie się dzieje (wybija bezpiecznik, brak prądu w części obwodów, iskrzenie)','od kiedy i po czym wystąpiło','zdjęcie rozdzielnicy'],uwaga:'Przy awarii często możemy przyjechać jeszcze tego samego dnia - najszybciej zadzwoń.'},
    pomiary:{n:'Pomiary elektryczne z protokołem',par:'obw',lista:['rodzaj pomiarów: odbiorcze czy okresowe','orientacyjna liczba obwodów lub rozdzielnic','termin, na który potrzebny jest protokół']},
    alarm:{n:'System alarmowy',par:'czujki',lista:['rzut lub szkic obiektu z wejściami i oknami','czy w obiekcie są zwierzęta (dobór czujek)','czy alarm ma współpracować z monitoringiem lub smart home']},
    monitoring:{n:'Monitoring (CCTV)',par:'kamery',lista:['co ma być widać: wjazd, wejście, ogród, hala','czy jest internet w miejscu montażu rejestratora','jak długo przechowywać nagrania']},
    domofon:{n:'Domofon / wideodomofon',par:'wejscia',lista:['dom jednorodzinny czy budynek wielorodzinny','odległość furtki od domu i czy jest przewód','domofon czy wideodomofon z podglądem w telefonie']},
    smart:{n:'Automatyka budynkowa (smart home)',par:'m2',lista:['co chcesz sterować: światło, rolety, brama, ogrzewanie','etap budowy lub remontu','czy masz już wybrany system']},
    inne:{n:'Inne: odgromowa, PPOŻ, sieć, kompensacja',par:null,lista:['krótki opis potrzeby','rodzaj i wielkość obiektu','dokumentacja lub projekt, jeśli jest']}
  };
  const P={
    m2:{t:'Powierzchnia',min:20,max:600,step:5,def:70,j:'m²',k:'Powierzchnia'},
    obw:{t:'Liczba obwodów (ok.)',min:1,max:120,step:1,def:12,j:'obw.',k:'Obwody'},
    czujki:{t:'Liczba czujek / pomieszczeń',min:1,max:40,step:1,def:6,j:'szt.',k:'Czujki'},
    kamery:{t:'Liczba kamer',min:1,max:32,step:1,def:4,j:'szt.',k:'Kamery'},
    wejscia:{t:'Liczba wejść / lokali',min:1,max:60,step:1,def:1,j:'szt.',k:'Wejścia / lokale'}
  };
  const st={usl:'nowa',obiekt:'Mieszkanie',etap:'Remont',wart:{}};
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const par=$('par'),out=$('parWart'),fs=par.closest('fieldset');

  function ustawPar(){
    const u=U[st.usl];
    if(!u.par){fs.querySelector('.suwak').hidden=true;$('parTytul').textContent='Stan obiektu';return}
    fs.querySelector('.suwak').hidden=false;
    const p=P[u.par];$('parTytul').textContent=p.t;
    par.min=p.min;par.max=p.max;par.step=p.step;par.value=st.wart[u.par]??p.def;
    out.textContent=par.value+' '+p.j;
  }
  function wiersz(k,v){return '<div><dt>'+k+'</dt><dd'+(v?'':' class="puste"')+'>'+(v?esc(v):'do uzupełnienia')+'</dd></div>'}
  function dane(){
    const u=U[st.usl],R=[['Usługa',u.n],['Obiekt',st.obiekt]];
    if(u.par){const p=P[u.par];R.push([p.k,par.value+' '+p.j])}
    R.push(['Stan',st.etap],['Miejscowość',$('miejsce').value],['Termin',$('kiedy').value]);
    const im=$('imie').value.trim(),t=$('tel').value.trim(),w=$('uwagi').value.trim();
    R.push(['Kontakt',[im,t].filter(Boolean).join(', ')]);
    if(w)R.push(['Opis',w]);
    return R;
  }
  function tekst(){return ['Dzień dobry, proszę o wycenę.',''].concat(dane().map(r=>r[0]+': '+(r[1]||'-'))).concat(['','Wiadomość przygotowana na stronie gkeltech.pl']).join('\n')}
  function rysuj(){
    const u=U[st.usl];
    $('kTyt').textContent=u.n;
    $('kTresc').innerHTML=dane().map(r=>wiersz(r[0],r[1])).join('');
    $('kLista').innerHTML=u.lista.map(x=>'<li>'+esc(x)+'</li>').join('');
    $('kCena').textContent=u.uwaga||'Orientacyjną kwotę podamy po krótkiej rozmowie telefonicznej lub obejrzeniu obiektu.';
    $('kMail').href='mailto:biuro@gkeltech.pl?subject='+encodeURIComponent('Zapytanie: '+u.n+' - '+$('miejsce').value)+'&body='+encodeURIComponent(tekst());
  }
  function grupa(sel,fn){
    const g=document.querySelector('#konfig .opcje[data-p="'+sel+'"]');
    g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b.dataset.v);rysuj()});
  }
  grupa('usl',v=>{st.usl=v;ustawPar()});
  grupa('obiekt',v=>{st.obiekt=v});
  grupa('etap',v=>{st.etap=v});
  par.addEventListener('input',()=>{const u=U[st.usl];if(!u.par)return;st.wart[u.par]=par.value;out.textContent=par.value+' '+P[u.par].j;rysuj()});
  ['miejsce','kiedy','imie','tel','uwagi'].forEach(i=>$(i).addEventListener('input',rysuj));
  $('kKopiuj').addEventListener('click',async()=>{const b=$('kKopiuj');try{await navigator.clipboard.writeText(tekst());b.textContent='Skopiowano'}catch(e){b.textContent='Nie udało się skopiować'}setTimeout(()=>b.textContent='Kopiuj treść',1800)});
  ustawPar();rysuj();
})();

/* mapa realizacji (OpenStreetMap) */
(function(){
  const box=document.getElementById('mapa');
  function start(){
    if(!box||!window.L||box._ok)return;box._ok=1;
    const O=[
      [53.4366,14.5185,'Stadion Miejski im. Floriana Krygiera','Szczecin · instalacje na potrzeby HVAC'],
      [53.4329,14.5590,'Teatr Polski w Szczecinie','Szczecin · instalacje na potrzeby HVAC'],
      [53.4745,14.4590,'Międzygminny Zakład Aktywności Zawodowej','Dobra · wymiana oświetlenia i monitoring'],
      [53.9700,14.7740,'Uzdrowisko w Kamieniu Pomorskim','Kamień Pomorski · instalacja PPOŻ']
    ];
    const map=L.map(box,{scrollWheelZoom:false,attributionControl:true});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    const ik=c=>L.divIcon({className:'',html:'<div class="pin '+c+'"></div>',iconSize:[22,22],iconAnchor:[11,11]});
    const M=O.map(o=>L.marker([o[0],o[1]],{icon:ik('')}).addTo(map).bindPopup('<b>'+o[2]+'</b>'+o[3]));
    L.marker([53.4600,14.4890],{icon:ik('baza')}).addTo(map).bindPopup('<b>GK ELTECH - siedziba</b>Bezrzecze, ul. Miętowa 16A');
    map.fitBounds(L.latLngBounds(O.slice(0,3).map(o=>[o[0],o[1]]).concat([[53.4600,14.4890],[53.552,14.571]])).pad(.12));
    document.querySelectorAll('#obiekty button').forEach(b=>b.addEventListener('click',()=>{
      const i=+b.dataset.i;document.querySelectorAll('#obiekty button').forEach(x=>x.classList.toggle('akt',x===b));
      map.flyTo([O[i][0],O[i][1]],14,{duration:.8});M[i].openPopup();
      if(innerWidth<=900)box.scrollIntoView({behavior:'smooth',block:'center'});
    }));
  }
  if(!box)return;
  const go=()=>{if(window.L)start();else window.addEventListener('load',start,{once:true})};
  if('IntersectionObserver' in window){const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){io.disconnect();go()}},{rootMargin:'400px'});io.observe(box)}else go();
})();
