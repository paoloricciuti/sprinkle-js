const getDomElement=a=>"string"==typeof a?document.querySelector(a):a,updateDom=(a,b,c=[])=>{const d=Object.entries(b);for(let[e,f]of d){if("object"==typeof f)return void updateDom(a,f,[...c,e]);let b=a;for(const a of c)b=b[a];"style"===c[c.length-1]&&b.setProperty(e,f),b[e]=f;}},createMatrix=(a,b)=>[...Array(a).keys()].map(()=>Array(b).fill(0)),diff=(a=[],b=[],c=(c,a)=>c===a)=>{var d=Math.min;//create a matrix with the two lengths +1
const e=createMatrix(a.length+1,b.length+1);//initialize the first row
for(let d=0;d<a.length+1;d++)e[d][0]=d;//initialize the first column
for(let d=0;d<b.length+1;d++)e[0][d]=d;//cicle through the two arrays
for(let f=0;f<a.length;f++)for(let g=0;g<b.length;g++)//if the two elements are equal
if(c(a[f],b[g]))//set the diagonal element equal to the current one
e[f+1][g+1]=e[f][g];else {//else set the diagonal element to the min between the bottom and right element
const a=d(e[f+1][g],e[f][g+1])+1;e[f+1][g+1]=a;}//inizialize the stack
const f=[];//get the lenghts of the arrays
let g=a.length,h=b.length;//while one of the two lengths is greater than 0
for(;0<g&&0<h;)//if the inth and jnth elements of the array are equals
c(a[g-1],b[h-1])?(//prepend the current value with a type of equal
f.unshift({type:"=",value:a[g-1]}),h--,g--):e[g-1][h]<e[g][h-1]?(f.unshift({type:"-",value:a[g-1]}),g--):(f.unshift({type:"+",value:b[h-1]}),h--);return 0<g?f.unshift(...(a?.slice?.(0,g)?.map?.(a=>({type:"-",value:a}))||[])):0<h&&f.unshift(...(b?.slice?.(0,h)?.map?.(a=>({type:"+",value:a}))||[])),f},findNext=(a,b,c=0)=>a.find((a,d,...e)=>d>c&&b(a,d,...e));

const context=[];function subscribe(a,b){b.add(a),a.dependencies.add(b);}const createVariable=a=>{if("object"!=typeof a)throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");const b=new Set,c=new Proxy(a,{get:(...a)=>{const c=context[context.length-1];return c&&subscribe(c,b),Reflect.get(...a)},set:(...a)=>{const c=Reflect.set(...a);for(const c of [...b])c.execute();return c}});return c},createRef=a=>createVariable({value:a}),cleanup=a=>{for(const b of a.dependencies)b.delete(a);a.dependencies.clear();},createEffect=a=>{const b=()=>{cleanup(c),context.push(c);try{a();}finally{context.pop();}},c={execute:b,dependencies:new Set};b();},bindTextContent=(a,b)=>{const c=getDomElement(a);createEffect(()=>{c&&(c.textContent=b());});},bindInputValue=(a,b)=>{const c=getDomElement(a);createEffect(()=>{c&&(c.value=b());});},bindDom=(a,b)=>{const c=getDomElement(a);createEffect(()=>updateDom(c,b()));},bindStyle=(a,b)=>{const c=getDomElement(a);c&&bindDom(c,()=>({style:b()}));},bindChildrens=(a,b)=>{const c=getDomElement(a);createEffect(()=>{if(null===c)return;const a=b();if(0===c.childNodes.length)return void c.append(...Array.from(a));const d=diff([...Array.from(c.childNodes)],[...Array.from(a)],(c,a)=>null!=c.key&&null!=a.key?c.key===a.key:c===a);let e=d.find(a=>"="===a.type),f=0;for(let a of d){if("+"===a.type){if(!e){c.append(a.value),f++;continue}e.value.before(a.value);}else "-"===a.type?c.removeChild(a.value):e=findNext(d,a=>"="===a.type,f);f++;}});};

export { bindChildrens, bindDom, bindInputValue, bindStyle, bindTextContent, createEffect, createRef, createVariable };
