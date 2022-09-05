(function(d,b){typeof exports=="object"&&typeof module<"u"?b(exports):typeof define=="function"&&define.amd?define(["exports"],b):(d=typeof globalThis<"u"?globalThis:d||self,b(d.SprinkleJS={}))})(this,function(d){"use strict";const b=e=>typeof e=="string"?document.querySelector(e):e,C=(e,t,n=[])=>{const s=Object.entries(t);for(let[l,c]of s){if(typeof c=="object"){C(e,c,[...n,l]);continue}let o=e;for(const i of n)o=o[i];if(n[n.length-1]==="style"&&l.startsWith("--")){o.setProperty(l,c);continue}if(l==="className"&&e instanceof SVGElement){o.setAttribute("class",c.toString());continue}if(n.length===0&&l.startsWith("data-")){e.setAttribute(l,c);continue}o[l]=c}},I=(e,t)=>[...Array(e).keys()].map(()=>Array(t).fill(0)),L=(e=[],t=[],n=(s,l)=>s===l)=>{var i,u,y,p,f,a;const s=I(e.length+1,t.length+1);for(let r=0;r<e.length+1;r++)s[r][0]=r;for(let r=0;r<t.length+1;r++)s[0][r]=r;for(let r=0;r<e.length;r++)for(let w=0;w<t.length;w++)if(n(e[r],t[w]))s[r+1][w+1]=s[r][w];else{const Y=Math.min(s[r+1][w],s[r][w+1])+1;s[r+1][w+1]=Y}const l=[];let c=e.length,o=t.length;for(;c>0&&o>0;)n(e[c-1],t[o-1])?(l.unshift({type:"=",value:e[c-1],skip:!1}),o--,c--):s[c-1][o]<s[c][o-1]?(l.unshift({type:"-",value:e[c-1],skip:!1}),c--):(l.unshift({type:"+",value:t[o-1],skip:!1}),o--);return c>0?l.unshift(...((y=(u=(i=e==null?void 0:e.slice)==null?void 0:i.call(e,0,c))==null?void 0:u.map)==null?void 0:y.call(u,r=>({type:"-",value:r,skip:!1})))||[]):o>0&&l.unshift(...((a=(f=(p=t==null?void 0:t.slice)==null?void 0:p.call(t,0,o))==null?void 0:f.map)==null?void 0:a.call(f,r=>({type:"+",value:r,skip:!1})))||[]),l},E=(e,t,n=0)=>e.find((s,l,...c)=>l>n&&t(s,l,...c)),R=e=>Object.prototype.toString.call(e).slice(8,-1),V=e=>{const t=document.createElement("template");return Object.assign(t,{innerHTML:e}),t.content},N=(e,t)=>e.getAttribute(t),g=e=>e instanceof Element?N(e,"key"):e.textContent;let h=[];const k=Symbol("is-reactive");let v=null;const P=e=>{v=new Set;try{e()}finally{const t=new Set(v);v=null,A(t)}},j=(e,t,n)=>{let s=n.get(e);s||(s=new Set,n.set(e,s)),s.add(t),t.dependencies.add(s)},A=e=>{[...e].forEach(t=>{if(!t.toRun)return;const n=t.execute();n&&(t.cleanup=n)})},O=(e,t)=>{const n=e.get(t);if(!!n){if(v!==null){n.forEach(s=>v.add(s));return}A(n)}},S=(e,t)=>{if(e[k])return e;if(typeof e!="object")throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");const n=Object.keys(e||{});for(let c of n){const o=c;!!e[o]&&typeof e[o]=="object"&&(R(e[o])==="Object"||Array.isArray(e[o]))&&(e[o]=S(e[o],t==null?void 0:t[o]))}const s=new Map;return new Proxy(e,{get:(...c)=>{if(c[1]===k)return!0;const o=h[h.length-1];return o&&j(c[1],o,s),Reflect.get(...c)},set:(c,o,i)=>{var r;const u=o,y=(r=t==null?void 0:t[u])!=null?r:Object.is;let p=i;!!i&&typeof i=="object"&&(R(i)==="Object"||Array.isArray(i))&&!i[k]&&(p=S(i,y));const f=y(c[u],i),a=Reflect.set(c,o,p);return f||O(s,o),a}})},x=(e,t,n=":root")=>{const s=S(e,t);let l=b(n);return l||(console.warn("Impossible to find the right html element, attaching the variables to the root."),l=document.querySelector(":root")),m(()=>{Object.keys(s).forEach(o=>{var i;l.style.setProperty(`--${o}`,(i=s[o])==null?void 0:i.toString())})}),s},J=(e,t)=>{const n={value:e()};let s=!1;const l=new Map,c=new Proxy(n,{get:(...o)=>{const i=h[h.length-1];return i&&j(o[1],i,l),Reflect.get(...o)},set:(o,i,u)=>{if(!s)return!0;const y=i,f=(t!=null?t:Object.is)(o[y],u),a=Reflect.set(o,i,u);return f||O(l,i),a}});return m(()=>{s=!0,c.value=e(),s=!1}),c},_=(e,t,n,s=window.localStorage)=>{if(typeof t!="object")throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");const l=new Map;let c=null;try{const i=s.getItem(e);i?c=JSON.parse(i):s.setItem(e,JSON.stringify(t))}catch{throw new Error("The specified key is associated with a non Object-like element")}const o=new Proxy(c!=null?c:t,{get:(...i)=>{const u=h[h.length-1];return u&&j(i[1],u,l),Reflect.get(...i)},set:(i,u,y)=>{var w;const p=u,a=((w=n==null?void 0:n[p])!=null?w:Object.is)(i[p],y),r=Reflect.set(i,u,y);return s.setItem(e,JSON.stringify(i)),a||O(l,u),r}});return window.addEventListener("storage",i=>{if(i.storageArea===s&&i.key===e)try{if(i.newValue){const u=JSON.parse(i.newValue);for(let y in u)o[y]=u[y]}}catch{console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.")}}),o},H=(e,t)=>S({value:e},t?{value:t}:void 0),T=e=>{e.owned.forEach(t=>{t.toRun=!1,T(t)});for(const t of e.dependencies)t.delete(e);e.dependencies.clear()},m=e=>{const t=()=>{var c,o,i;if(!n.toRun)return;(i=(o=(c=n==null?void 0:n.owner)==null?void 0:c.owned)==null?void 0:o.push)==null||i.call(o,n),n.cleanup&&typeof n.cleanup=="function"&&n.cleanup(),T(n),h.push(n);let l;try{l=e()}finally{h.pop()}return l},n={execute:t,dependencies:new Set,owned:[],owner:h[h.length-1],toRun:!0},s=t();s&&(n.cleanup=s)},U=e=>{const t=h;h=[];const n=e();return h=t,n},W=(e,t)=>{const n=b(e);return m(()=>{n&&(n.textContent=t(n))}),n},F=(e,t)=>{const n=b(e);return m(()=>{n&&(n.innerHTML=t(n))}),n},B=(e,t,n)=>{const s=b(e);return m(()=>{s&&(n(s)?s.classList.add(t):s.classList.remove(t))}),s},D=(e,t)=>{const n=b(e);return m(()=>{if(n){const s=t(n),l=Object.keys(s||{});for(let c of l)s[c]?n.classList.add(c):n.classList.remove(c)}}),n},G=(e,t)=>{const n=b(e);return m(()=>{n&&(n.value=t(n))}),n},M=(e,t)=>{const n=b(e);return m(()=>C(n,t(n))),n},K=(e,t)=>{const n=b(e);if(!!n)return M(n,()=>({style:t(n)})),n},Q=(e,t,n)=>{const s=b(e);return m(()=>{if(s===null)return;const l=t(s),c=V(l).childNodes,o=new Map,i=(f,a=!0)=>{const r=g(f);(r!==null||r!=null)&&o.set(r,{element:f,isNew:a})};if(s.children.length===0){const f=Array.from(c);s.append(...f),f.forEach(a=>i(a)),typeof n=="function"&&m(()=>{n(s,o)});return}const u=L(Array.from(s.childNodes),Array.from(c),(f,a)=>g(f)!=null&&g(a)!=null?g(f)===g(a):f===a);let y=u.find(f=>f.type==="="),p=0;for(let f of u){if(f.type==="+"){const a=E(u,r=>r.type==="-"&&g(r.value)===g(f.value),p);if(a&&(f.value=a.value,a.skip=!0),!y){s.append(f.value),i(f.value),p++;continue}y.value.before(f.value),i(f.value)}else if(f.type==="-"){if(f.skip){p++;continue}s.removeChild(f.value);const a=E(u,r=>r.type==="+"&&g(r.value)===g(f.value),p);a&&(a.value=f.value)}else y=E(u,a=>a.type==="=",p),i(f.value,!1);p++}typeof n=="function"&&m(()=>{n(s,o)})}),s};d.batch=P,d.bindChildrens=Q,d.bindClass=B,d.bindClasses=D,d.bindDom=M,d.bindInnerHTML=F,d.bindInputValue=G,d.bindStyle=K,d.bindTextContent=W,d.createComputed=J,d.createCssVariable=x,d.createEffect=m,d.createRef=H,d.createStored=_,d.createVariable=S,d.untrack=U,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
