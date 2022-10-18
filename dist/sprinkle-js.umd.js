(function(f,b){typeof exports=="object"&&typeof module<"u"?b(exports):typeof define=="function"&&define.amd?define(["exports"],b):(f=typeof globalThis<"u"?globalThis:f||self,b(f.SprinkleJS={}))})(this,function(f){"use strict";const b=e=>typeof e=="string"?document.querySelector(e):e,T=(e,t,n=[])=>{Object.entries(t).forEach(([i,o])=>{if(typeof o=="object"){T(e,o,[...n,i]);return}let c=e;if(n.forEach(a=>{c=c[a]}),n[n.length-1]==="style"&&i.startsWith("--")){c.setProperty(i,o);return}if(i==="className"&&e instanceof SVGElement){c.setAttribute("class",o.toString());return}if(n.length===0&&i.startsWith("data-")){e.setAttribute(i,o);return}c[i]=o})},M=(e,t)=>[...Array(e).keys()].map(()=>Array(t).fill(0)),N=(e=[],t=[],n=(s,i)=>s===i)=>{var a,d,y,p,r,u;const s=M(e.length+1,t.length+1);for(let l=0;l<e.length+1;l+=1)s[l][0]=l;for(let l=0;l<t.length+1;l+=1)s[0][l]=l;for(let l=0;l<e.length;l+=1)for(let C=0;C<t.length;C+=1)if(n(e[l],t[C]))s[l+1][C+1]=s[l][C];else{const te=Math.min(s[l+1][C],s[l][C+1])+1;s[l+1][C+1]=te}const i=[];let o=e.length,c=t.length;for(;o>0&&c>0;)n(e[o-1],t[c-1])?(i.unshift({type:"=",value:e[o-1],skip:!1}),c-=1,o-=1):s[o-1][c]<s[o][c-1]?(i.unshift({type:"-",value:e[o-1],skip:!1}),o-=1):(i.unshift({type:"+",value:t[c-1],skip:!1}),c-=1);return o>0?i.unshift(...((y=(d=(a=e==null?void 0:e.slice)==null?void 0:a.call(e,0,o))==null?void 0:d.map)==null?void 0:y.call(d,l=>({type:"-",value:l,skip:!1})))||[]):c>0&&i.unshift(...((u=(r=(p=t==null?void 0:t.slice)==null?void 0:p.call(t,0,c))==null?void 0:r.map)==null?void 0:u.call(r,l=>({type:"+",value:l,skip:!1})))||[]),i},O=(e,t,n=0)=>e.find((s,i,...o)=>i>n&&t(s,i,...o)),A=e=>Object.prototype.toString.call(e).slice(8,-1),_=e=>{const t=document.createElement("template");return Object.assign(t,{innerHTML:e}),t.content},P=(e,t)=>e.getAttribute(t),E=e=>e instanceof Element?P(e,"key"):e.textContent;let m=[];const g=Symbol("is-reactive"),S=Symbol("memo");let k=null;const R=e=>{[...e].forEach(t=>{if(!t.toRun)return;const n=t.execute();n&&(t.cleanup=n)})},U=e=>{k=new Set;try{e()}finally{const t=new Set(k);k=null,R(t)}},F=(e,t,n)=>{let s=n.get(e);s||(s=new Set,n.set(e,s)),s.add(t),t.dependencies.add(s)},J=(e,t)=>{const n=e.get(t);if(!!n){if(k!==null){n.forEach(s=>k.add(s));return}R(n)}},H=(e,t)=>{if(e[g])return e;if(typeof e!="object")throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");Object.keys(e||{}).forEach(o=>{const c=o;!!e[c]&&typeof e[c]=="object"&&(A(e[c])==="Object"||Array.isArray(e[c]))&&(e[c]=w(e[c],t==null?void 0:t[c]))});const s=new Map;return new Proxy(e,{get:(...o)=>{if(o[1]===g)return!0;const c=m[m.length-1];return c&&F(o[1],c,s),Reflect.get(...o)},set:(o,c,a)=>{var l;if(o[S]===!1&&c!==S)return!0;const d=c,y=(l=t==null?void 0:t[d])!=null?l:Object.is;let p=a;!!a&&typeof a=="object"&&(A(a)==="Object"||Array.isArray(a))&&!a[g]&&(p=w(a,y));const r=y(o[d],a),u=Reflect.set(o,c,p);return r||J(s,c),u}})},$=(e,t,n=":root")=>{const s=w(e,t);let i=b(n);return i||(console.warn("Impossible to find the right html element, attaching the variables to the root."),i=document.querySelector(":root")),h(()=>{Object.keys(s).forEach(c=>{var a;i.style.setProperty(`--${c}`,(a=s[c])==null?void 0:a.toString())})}),s},D=(e,t)=>{const n={value:e(),[S]:!1},s=w(n,t?{value:t}:void 0);return h(()=>{s[S]=!0,s.value=e(),s[S]=!1}),s},W=(e,t,n,s=window.localStorage)=>{if(typeof t!="object")throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");let i=null;try{const c=s.getItem(e);c?i=JSON.parse(c):s.setItem(e,JSON.stringify(t))}catch{throw new Error("The specified key is associated with a non Object-like element")}const o=w(i!=null?i:t,n);return h(()=>{s.setItem(e,JSON.stringify(o))}),window.addEventListener("storage",c=>{if(c.storageArea===s&&c.key===e)try{if(c.newValue){const a=JSON.parse(c.newValue);Object.keys(a).forEach(y=>{o[y]=a[y]})}}catch{console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.")}}),o},x=(e,t)=>w({value:e},t?{value:t}:void 0),I=e=>{e.owned.forEach(t=>{t.toRun=!1,I(t)}),e.dependencies.forEach(t=>{t.delete(e)}),e.dependencies.clear()},j={createVariable:H,createEffect:e=>{const t=()=>{var o,c,a;if(!n.toRun)return;(a=(c=(o=n==null?void 0:n.owner)==null?void 0:o.owned)==null?void 0:c.push)==null||a.call(c,n),n.cleanup&&typeof n.cleanup=="function"&&n.cleanup(),I(n),m.push(n);let i;try{i=e()}finally{m.pop()}return i},n={execute:t,dependencies:new Set,owned:[],owner:m[m.length-1],toRun:!0},s=t();s&&(n.cleanup=s)},createComputed:D};let v={...j};const w=(e,t)=>v.createVariable(e,t),h=e=>v.createEffect(e),B=(e,t)=>v.createComputed(e,t),G=(e=j)=>(Object.keys(e).forEach(t=>{v[t]=e[t]}),()=>{v=j}),Q=e=>{const t=m;m=[];const n=e();return m=t,n},Y=(e,t)=>{const n=b(e);return h(()=>{n&&(n.textContent=t(n))}),n},z=(e,t)=>{const n=b(e);return h(()=>{n&&(n.innerHTML=t(n))}),n},X=(e,t,n)=>{const s=b(e);return h(()=>{s&&(n(s)?s.classList.add(t):s.classList.remove(t))}),s},Z=(e,t)=>{const n=b(e);return h(()=>{if(n){const s=t(n);Object.keys(s||{}).forEach(o=>{s[o]?n.classList.add(o):n.classList.remove(o)})}}),n},K=(e,t)=>{const n=b(e);return h(()=>{n&&(n.value=t(n))}),n},L=(e,t)=>{const n=b(e);return h(()=>T(n,t(n))),n},q=(e,t)=>{const n=b(e);if(!!n)return L(n,()=>({style:t(n)})),n},V=(e,t,n)=>{const s=b(e);return h(()=>{if(s===null)return;const i=t(s),o=_(i).childNodes,c=new Map,a=(r,u=!0)=>{const l=E(r);l!=null&&c.set(l,{element:r,isNew:u})};if(s.children.length===0){const r=Array.from(o);s.append(...r),r.forEach(u=>a(u)),typeof n=="function"&&h(()=>{n(s,c)});return}const d=N(Array.from(s.childNodes),Array.from(o),(r,u)=>E(r)!=null&&E(u)!=null?E(r)===E(u):r===u);let y=d.find(r=>r.type==="="),p=0;d.forEach(r=>{if(r.type==="+"){const u=O(d,l=>l.type==="-"&&E(l.value)===E(r.value),p);if(u&&(r.value=u.value,u.skip=!0),!y){s.append(r.value),a(r.value),p+=1;return}y.value.before(r.value),a(r.value)}else if(r.type==="-"){if(r.skip){p+=1;return}s.removeChild(r.value);const u=O(d,l=>l.type==="+"&&E(l.value)===E(r.value),p);u&&(u.value=r.value)}else y=O(d,u=>u.type==="=",p),a(r.value,!1);p+=1}),typeof n=="function"&&h(()=>{n(s,c)})}),s},ee=((e,t,n)=>(console.warn(`${t}${n?`See more at ${n}`:""}`),e))(V,"'bindChildrens' is deprecated: please use 'bindChildren' instead.",new URL("https://github.com/paoloricciuti/sprinkle-js/issues/3"));f.batch=U,f.bindChildren=V,f.bindChildrens=ee,f.bindClass=X,f.bindClasses=Z,f.bindDom=L,f.bindInnerHTML=z,f.bindInputValue=K,f.bindStyle=q,f.bindTextContent=Y,f.createComputed=B,f.createCssVariable=$,f.createEffect=h,f.createRef=x,f.createStored=W,f.createVariable=w,f.setup=G,f.untrack=Q,Object.defineProperties(f,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
