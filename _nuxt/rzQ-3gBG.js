import u from"./Djq-K4L7.js";import d from"./COm1uFm8.js";import{d as l,f as m,w as f,c as h,a as y,u as g,t as x,o as w,b as p,e as A,j as k,_ as q}from"./CCXT-GXq.js";import"./CGt6lxgT.js";import"./CKnmF6yR.js";const v={class:"legal__wrapper"},C=l({__name:"shipping-and-returns",async setup(R){let t,s;const _=m(),{data:i}=([t,s]=f(async()=>g("shippingAndReturns",async()=>{var o;const a=`#graphql
query GetShippingAndReturns {
  metaobjects(type: "shipping_and_returns", first: 1) {
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
`,{data:e,error:n}=await x(_.request(a));if(n)throw n;return(o=e.data)==null?void 0:o.metaobjects})),t=await t,s(),t);return(a,e)=>{const n=u,o=d;return w(),h(o,null,{default:y(()=>{var r,c;return[p("div",v,[e[0]||(e[0]=p("h2",null,"Shipping and returns",-1)),A(n,{content:(c=(r=k(i))==null?void 0:r.nodes[0].content)==null?void 0:c.value},null,8,["content"])])]}),_:1})}}}),V=q(C,[["__scopeId","data-v-2171f402"]]);export{V as default};
