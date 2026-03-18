import d from"./Djq-K4L7.js";import p from"./COm1uFm8.js";import{d as u,f,w as l,c as y,a as h,u as x,t as v,o as w,b as _,e as k,j as q,_ as C}from"./CCXT-GXq.js";import"./CGt6lxgT.js";import"./CKnmF6yR.js";const b={class:"legal__wrapper"},g=u({__name:"terms-of-service",async setup(j){let t,s;const i=f(),{data:m}=([t,s]=l(async()=>x("terms",async()=>{var n;const a=`#graphql
query GetTerms {
  metaobjects(type: "terms_and_conditions", first: 1) {
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
`,{data:e,error:o}=await v(i.request(a));if(o)throw o;return(n=e.data)==null?void 0:n.metaobjects})),t=await t,s(),t);return(a,e)=>{const o=d,n=p;return w(),y(n,null,{default:h(()=>{var r,c;return[_("div",b,[e[0]||(e[0]=_("h2",null,"terms of service",-1)),k(o,{content:(c=(r=q(m))==null?void 0:r.nodes[0].content)==null?void 0:c.value},null,8,["content"])])]}),_:1})}}}),V=C(g,[["__scopeId","data-v-e3dcd931"]]);export{V as default};
