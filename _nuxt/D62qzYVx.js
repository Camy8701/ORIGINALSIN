import l from"./Djq-K4L7.js";import y from"./COm1uFm8.js";import{d,f as u,w as m,c as f,a as v,u as h,t as x,o as w,b as _,e as P,j as k,_ as q}from"./CCXT-GXq.js";import"./CGt6lxgT.js";import"./CKnmF6yR.js";const C={class:"legal__wrapper"},b=d({__name:"privacy-policy",async setup(g){let t,n;const i=u(),{data:p}=([t,n]=m(async()=>h("privacyPolicy",async()=>{var a;const c=`#graphql
query GetPrivacyPolicy {
  metaobjects(type: "privacy_policy", first: 1) {
    nodes {
      id
      handle
      content: field(key: "content") {
        key
        value
      }
    }
  }
}
`,{data:e,error:o}=await x(i.request(c));if(o)throw o;return(a=e.data)==null?void 0:a.metaobjects})),t=await t,n(),t);return(c,e)=>{const o=l,a=y;return w(),f(a,null,{default:v(()=>{var s,r;return[_("div",C,[e[0]||(e[0]=_("h2",null,"Privacy Policy",-1)),P(o,{content:(r=(s=k(p))==null?void 0:s.nodes[0].content)==null?void 0:r.value},null,8,["content"])])]}),_:1})}}}),V=q(b,[["__scopeId","data-v-26adca3e"]]);export{V as default};
