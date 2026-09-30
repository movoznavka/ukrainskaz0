/* Додаткові типи вправ: швидке сортування за родом, впиши закінчення, знайди слова в тексті + короткі помічники */
window.Extra=(function(){
var G={m:['він','#3B7DD8','#E3EEFC'],f:['вона','#D9558C','#FCE4EE'],n:['воно','#C98505','#FFF1D0']};
var st=document.createElement('style');st.textContent=
'.gd-word{font:700 2rem Comfortaa,sans-serif;text-align:center;margin:10px 0}.gd-btns{justify-content:center}'+
'.gd-bins{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}.gd-bin{border-radius:12px;padding:8px;min-height:70px;font-weight:800;font-size:.85rem}'+
'.gd-bin span{display:inline-block;background:#fff;border-radius:8px;padding:2px 8px;margin:3px 3px 0 0;font-weight:700}'+
'.fi-row{margin:10px 0;font-size:1.05rem}.fi-row input{width:3.2em;font:800 1rem Nunito,sans-serif;text-align:center;border:2px solid #C9DCC7;border-radius:8px;padding:4px}'+
'.fi-row input.ok{border-color:#386B39;background:#DCEEDC}.fi-row input.no{border-color:#C2542C;background:#FBE4DC}'+
'.wp-text{line-height:2.2;font-family:Literata,serif;font-size:1.05rem}.wp-text .clickable-word{cursor:pointer;padding:2px 3px;border-radius:6px}'+
'.wp-text .clickable-word:hover{background:rgba(0,0,0,.06)}.wp-text .clickable-word.marked{background:#FFF1D0;box-shadow:0 0 0 2px #E9B23C inset}'+
'.wp-text .clickable-word.ok{background:#DCEEDC;box-shadow:0 0 0 2px #386B39 inset}.wp-text .clickable-word.no{background:#FBE4DC;box-shadow:0 0 0 2px #C2542C inset}';
document.head.appendChild(st);
function $(box){return typeof box==='string'?document.querySelector(box):box}
function mk(box,html,cls){var d=document.createElement('div');d.className=cls||'exercise';d.innerHTML=html||'';$(box).appendChild(d);return d}
function add(p,cls){var d=document.createElement('div');d.className=cls;p.appendChild(d);return d}
function star(e){try{LessonKit.addStar(e?e.clientX:innerWidth/2,e?e.clientY:200)}catch(_){}}
function choice(box,q,opts,ans){var d=mk(box,'<div class="q">'+q+'</div><div class="choices"></div><div class="feedback"></div>');
 LessonKit.initChoice(d,opts.map(function(t,i){return{text:t,correct:i===ans}}))}
function order(box,q,words){var d=mk(box,'<div class="q">'+q+'</div><div class="order-pool"></div><div class="order-answer"></div><div class="feedback"></div>');
 LessonKit.initOrderBuilder(d,words)}
function genderDrill(box,q,items){
 var d=mk(box,'<div class="q">'+q+'</div>'),i=0,err=0,w=add(d,'gd-word'),b=add(d,'choices gd-btns'),bins=add(d,'gd-bins'),fb=add(d,'feedback'),bx={};
 w.textContent=items[0][0];
 Object.keys(G).forEach(function(k){
  var bin=add(bins,'gd-bin');bin.style.background=G[k][2];bin.style.color=G[k][1];bin.innerHTML='<b>'+G[k][0]+' ('+{m:'мій',f:'моя',n:'моє'}[k]+')</b><br>';bx[k]=bin;
  var btn=document.createElement('button');btn.className='choice-btn';btn.textContent=G[k][0];btn.style.cssText='background:'+G[k][2]+';border-color:'+G[k][1]+';color:'+G[k][1];
  btn.onclick=function(e){
   if(i>=items.length)return;
   if(items[i][1]===k){var s=document.createElement('span');s.textContent=items[i][0];bx[k].appendChild(s);i++;fb.className='feedback ok';fb.textContent='✓';
    if(i<items.length)w.textContent=items[i][0];else{w.textContent='🎉';fb.textContent='Готово! Помилок: '+err;star(e)}}
   else{err++;fb.className='feedback no';fb.textContent='Ще ні. Спробуй підставити: мій / моя / моє 😉'}};
  b.appendChild(btn)})}
function fillIn(box,q,items){
 var d=mk(box,'<div class="q">'+q+'</div>'),ins=[],got=false;
 items.forEach(function(it){var r=add(d,'fi-row');r.append(it[0]);var inp=document.createElement('input');inp.maxLength=4;r.append(inp);r.append(' '+it[2]);ins.push(inp)});
 var btn=document.createElement('button');btn.className='btn small';btn.textContent='Перевірити';d.appendChild(btn);var fb=add(d,'feedback');
 btn.onclick=function(e){var n=0;ins.forEach(function(inp,i){var ok=inp.value.trim().toLowerCase()===items[i][1];inp.className=ok?'ok':'no';if(ok)n++});
  fb.className='feedback '+(n===ins.length?'ok':'no');fb.textContent=n===ins.length?'Усе правильно! 🎉':'Правильно: '+n+' з '+ins.length+'. Виправ червоні.';
  if(n===ins.length&&!got){got=true;star(e)}}}
function wordPick(box,q,text,targets){
 var d=mk(box,'<div class="q">'+q+'</div>'),t=add(d,'wp-text'),sp=[],got=false;
 text.split(/(\s+)/).forEach(function(x){var k=x.replace(/[.,!?—:;«»…]/g,'').toLowerCase();
  if(!k||/^\s+$/.test(x)){t.append(x);return}
  var s=document.createElement('span');s.className='clickable-word';s.dataset.w=k;s.textContent=x;s.onclick=function(){s.classList.toggle('marked')};t.appendChild(s);sp.push(s)});
 var btn=document.createElement('button');btn.className='btn small';btn.textContent='Перевірити';d.appendChild(btn);var fb=add(d,'feedback');
 btn.onclick=function(e){var hit=0,bad=0,sel=0;sp.forEach(function(s){var m=s.classList.contains('marked')||s.classList.contains('ok')||s.classList.contains('no'),tg=targets.indexOf(s.dataset.w)>-1;
   s.classList.remove('ok','no');if(m){sel++;s.classList.add('marked');if(tg){hit++;s.classList.remove('marked');s.classList.add('ok')}else{bad++;s.classList.remove('marked');s.classList.add('no')}}});
  var all=hit===targets.length&&!bad;fb.className='feedback '+(all?'ok':'no');
  fb.textContent=all?'Знайдено всі '+hit+'! 🎉':'Знайдено '+hit+' з '+targets.length+(bad?', зайвих: '+bad+' (червоні — зніми позначку)':'. Шукай ще!');
  if(!all)sp.forEach(function(s){if(s.classList.contains('no')){s.classList.remove('no');s.classList.add('marked')}});
  if(all&&!got){got=true;star(e)}}}
return{mk:mk,choice:choice,order:order,genderDrill:genderDrill,fillIn:fillIn,wordPick:wordPick}})();
