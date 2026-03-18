import{_ as C}from"./BWQsenpk.js";import{u as I,_ as A}from"./B08hbhNn.js";import b from"./COm1uFm8.js";import{f as j,u as q,t as B,d as F,g as S,w as l,c as p,a as G,h as M,o as _,b as N,i as h,j as n,_ as V}from"./CCXT-GXq.js";import"./CVcCgixj.js";import"./DmBYk3UX.js";import"./oet0pRz3.js";import"./CKnmF6yR.js";import"./COwUi6qa.js";import"./UeXxf9sz.js";import"./C0ZBnQQE.js";import"./C3MB0O9f.js";import"./DZYBT4IP.js";import"./BMnI1Hg6.js";import"./CGt6lxgT.js";const D=`#graphql
query GetFeaturedProducts {
  metaobjects(type: "featured_product", first: 30, sortKey: "sort_priority") {
    nodes {
      id
      sortPriority: field(key: "sort_priority") {
        value
      }
      product: field(key: "product") {
        reference {
          ... on Product {
            id
            handle
            featuredImage {
              url
              altText
            }
          }
        }
      }
      asset: field(key: "asset") {
        reference {
          ... on MediaImage {
            image {
              url
            }
            presentation {
              asJson(format: IMAGE)
            }
          }
        }
      }
    }
  }
}
`,E=async()=>{const m=j();return await q("featured-product",async()=>{var o;const{data:t,error:e}=await B(m.request(D));if(e)throw e;return(o=t.data)==null?void 0:o.metaobjects.nodes})},H=F({__name:"index",async setup(m){var f,y,P;let t,e;S();const{data:o}=([t,e]=l(()=>E()),t=await t,e(),t),x=((f=o.value)==null?void 0:f.sort((s,i)=>{var c,a;const d=(c=s.sortPriority)!=null&&c.value?parseInt(s.sortPriority.value):0;return((a=i.sortPriority)!=null&&a.value?parseInt(i.sortPriority.value):0)-d}))||[],{data:r}=([t,e]=l(()=>M()),t=await t,e(),t),u=((y=r.value)==null?void 0:y.length)===2?r.value[1]:(P=r.value)==null?void 0:P.find(s=>s.handle===""),g=I((u==null?void 0:u.id)??"all"),[{data:w}]=([t,e]=l(()=>Promise.all([g])),t=await t,e(),t),{products:k}=w.value;return(s,i)=>{const d=C,v=A,c=b;return _(),p(c,null,{default:G(()=>{var a;return[N("div",null,[(a=n(o))!=null&&a.length?(_(),p(d,{key:0,"featured-products":n(x)},null,8,["featured-products"])):h("",!0),n(r)?(_(),p(v,{key:1,"current-slug":"",collections:n(r),products:n(k)},null,8,["collections","products"])):h("",!0)])]}),_:1})}}}),et=V(H,[["__scopeId","data-v-058edee5"]]);export{et as default};
