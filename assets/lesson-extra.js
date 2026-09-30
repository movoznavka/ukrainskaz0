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

var st2=document.createElement('style');st2.textContent=
'.mp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mp-col{display:flex;flex-direction:column;gap:8px}.mp-btn{width:100%;text-align:center}'+
'.mp-btn.sel{outline:3px solid #E9B23C}.mp-btn.ok{background:#DCEEDC!important;border-color:#386B39!important;opacity:.7}.mp-btn.no{background:#FBE4DC!important;border-color:#C2542C!important}'+
'.mem-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0}.mem-card{min-height:64px;border-radius:14px;border:3px solid #C9DCC7;background:#fff;font:700 1rem Nunito,sans-serif;cursor:pointer;padding:4px}'+
'.mem-card.up{background:#FFF1D0;border-color:#E9B23C}.mem-card.ok{background:#DCEEDC;border-color:#386B39}'+
'.tw-row{margin:10px 0;font-size:1.05rem;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.tw-row input{width:9em;font:800 1rem Nunito,sans-serif;border:2px solid #C9DCC7;border-radius:8px;padding:5px 8px}'+
'.tw-row input.ok{border-color:#386B39;background:#DCEEDC}.tw-row input.no{border-color:#C2542C;background:#FBE4DC}'+
'.tf-s{font-size:1.15rem;font-weight:700;margin:10px 0;min-height:3em}.ef-item{margin:14px 0;padding:10px;border-radius:12px;background:#fff}';
document.head.appendChild(st2);
function sh(a){return a.slice().sort(function(){return Math.random()-.5})}
function norm(s){return s.trim().toLowerCase().replace(/['ʼ`]/g,'’').replace(/\s+/g,' ')}
function clean(s){return norm(s.replace(/[.,!?—:;«»…]/g,''))}
function btn(p,t,c){var b=document.createElement('button');b.className=c||'btn small';b.textContent=t;p.appendChild(b);return b}
/* З'єднай пари */
function matchPairs(box,q,pairs){
 var d=mk(box,'<div class="q">'+q+'</div>'),g=add(d,'mp-grid'),L=add(g,'mp-col'),R=add(g,'mp-col'),fb=add(d,'feedback'),sel=null,done=0,err=0;
 function col(c,side){sh(pairs.map(function(p,i){return[p[side],i]})).forEach(function(x){var b=btn(c,x[0],'choice-btn mp-btn');b.dataset.i=x[1];b.dataset.s=side;
  b.onclick=function(e){if(b.disabled)return;
   if(sel&&sel.dataset.s===b.dataset.s){sel.classList.remove('sel');sel=sel===b?null:b;if(sel)b.classList.add('sel');return}
   if(!sel){sel=b;b.classList.add('sel');return}
   var s=sel;s.classList.remove('sel');sel=null;
   if(s.dataset.i===b.dataset.i){s.classList.add('ok');b.classList.add('ok');s.disabled=b.disabled=true;done++;fb.className='feedback ok';fb.textContent='✓';
    if(done===pairs.length){fb.textContent='Усі пари! Помилок: '+err+' 🎉';star(e)}}
   else{err++;s.classList.add('no');b.classList.add('no');setTimeout(function(){s.classList.remove('no');b.classList.remove('no')},500);fb.className='feedback no';fb.textContent='Не пара. Подумай ще!'}}})}
 col(L,0);col(R,1)}
/* Гра на пам'ять */
function memory(box,q,pairs){
 var d=mk(box,'<div class="q">'+q+'</div>'),g=add(d,'mem-grid'),fb=add(d,'feedback'),open=[],lock=false,found=0,moves=0,cards=[];
 pairs.forEach(function(p,i){cards.push([p[0],i],[p[1],i])});
 sh(cards).forEach(function(c){var b=btn(g,'❓','mem-card');b.dataset.t=c[0];b.dataset.i=c[1];
  b.onclick=function(e){if(lock||b.classList.contains('up')||b.classList.contains('ok'))return;
   b.textContent=c[0];b.classList.add('up');open.push(b);
   if(open.length===2){moves++;var a=open[0];
    if(a.dataset.i===b.dataset.i){a.classList.replace('up','ok');b.classList.replace('up','ok');open=[];found++;
     if(found===pairs.length){fb.className='feedback ok';fb.textContent='Усе знайдено за '+moves+' ходів! 🎉';star(e)}}
    else{lock=true;setTimeout(function(){[a,b].forEach(function(x){x.classList.remove('up');x.textContent='❓'});open=[];lock=false},900)}}}})}
/* Впиши слово (opt.speak — диктант зі звуком) */
function typeWord(box,q,items,opt){
 opt=opt||{};var d=mk(box,'<div class="q">'+q+'</div>'),ins=[],got=false;
 items.forEach(function(it,k){var r=add(d,'tw-row');
  if(opt.speak){var sp=btn(r,'🔊 Слухати #'+(k+1),'btn small ghost');sp.onclick=function(){try{var u=new SpeechSynthesisUtterance(it[1]);u.lang='uk-UA';u.rate=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(_){r.append(' (звук недоступний)')}}}
  else r.append(it[0]);
  var inp=document.createElement('input');inp.autocomplete='off';r.appendChild(inp);ins.push(inp)});
 var b=btn(d,'Перевірити'),fb=add(d,'feedback');
 b.onclick=function(e){var n=0;ins.forEach(function(inp,i){var ok=items[i][1].split('|').some(function(a){return norm(a)===norm(inp.value)});inp.className=ok?'ok':'no';if(ok)n++});
  fb.className='feedback '+(n===items.length?'ok':'no');fb.textContent=n===items.length?'Усе правильно! 🎉':'Правильно: '+n+' з '+items.length+'. Виправ червоні.';
  if(n===items.length&&!got){got=true;star(e)}}}
/* Правда чи ні */
function trueFalse(box,q,items){
 var d=mk(box,'<div class="q">'+q+'</div>'),i=0,err=0,s=add(d,'tf-s'),bs=add(d,'choices gd-btns'),fb=add(d,'feedback');
 s.textContent=items[0][0];
 [[true,'✅ Правда'],[false,'❌ Неправда']].forEach(function(o){var b=btn(bs,o[1],'choice-btn');
  b.onclick=function(e){if(i>=items.length)return;
   if(items[i][1]===o[0]){i++;fb.className='feedback ok';fb.textContent='✓';
    if(i<items.length)s.textContent=items[i][0];else{s.textContent='🎉';fb.textContent='Готово! Помилок: '+err;if(err<=1)star(e)}}
   else{err++;fb.className='feedback no';fb.textContent='Ні. '+(items[i][2]||'Перевір: мій / моя / моє.')}}})}
/* Знайди й виправ помилку: клікни хибне слово, потім впиши правильне */
function errorFix(box,q,items){
 var d=mk(box,'<div class="q">'+q+'</div>'),done=0,got=false;
 items.forEach(function(it){var blk=add(d,'ef-item'),t=add(blk,'wp-text'),fx=add(blk,'tw-row'),fb=add(blk,'feedback'),fixed=false;fx.style.display='none';
  it[0].split(/(\s+)/).forEach(function(x){if(!x.trim()){t.append(x);return}
   var s=document.createElement('span');s.className='clickable-word';s.textContent=x;t.appendChild(s);
   s.onclick=function(){if(fixed||fx.style.display!=='none')return;
    if(clean(x)===it[1]){s.classList.add('no');fx.style.display='flex';fb.className='feedback ok';fb.textContent='Так, це воно! Впиши правильну форму:'}
    else{s.classList.add('no');setTimeout(function(){s.classList.remove('no')},500);fb.className='feedback no';fb.textContent='Тут усе гаразд. Шукай далі.'}}});
  var inp=document.createElement('input');fx.appendChild(inp);var b=btn(fx,'OK');
  b.onclick=function(e){if(fixed)return;if(norm(inp.value)===it[2]){fixed=true;inp.className='ok';fb.className='feedback ok';fb.textContent='Виправлено! ✓';done++;
    if(done===items.length&&!got){got=true;star(e)}}else{inp.className='no';fb.className='feedback no';fb.textContent='Ще ні. Підстав мій / моя / моє.'}}})}
return{mk:mk,choice:choice,order:order,genderDrill:genderDrill,fillIn:fillIn,wordPick:wordPick,matchPairs:matchPairs,memory:memory,typeWord:typeWord,trueFalse:trueFalse,errorFix:errorFix}})();
