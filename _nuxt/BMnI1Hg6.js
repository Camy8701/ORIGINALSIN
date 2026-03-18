import{a1 as e,a2 as a,a3 as i,a4 as o,a5 as s}from"./CCXT-GXq.js";const l=`#graphql
query Product($handle: String) {
    product(handle: $handle) {
        ...ProductFields
        options(first: 40) {
            id
            name
            optionValues {
                id
                name
            }
        }
        seo {
          title
          description
        }
        fitTable: metafield(key: "size_table", namespace: "custom") {
            value
            type
        }
        fit: metafield(key: "size_chart", namespace: "custom") {
            value
            type
        }
        materials: metafield(key: "material", namespace: "custom") {
            value
            type
        }
        shipping: metafield(key: "shipping_details", namespace: "custom") {
            value
            type
        }
        care: metafield(key: "care_guide", namespace: "custom") {
            value
            type
        }
        featureText: metafield(key: "feature_text", namespace: "custom") {
            value
        }
        featureText2: metafield(key: "feature_text_2", namespace: "custom") {
            value
        }
        images(first: 40) {
            nodes {
                ...ImageFields
            }
        }
        ...ProductColorVariantField
    }
}
${i}
${e}
${o}
${s}
`,t=`#graphql
fragment ProductsConnectionField on ProductConnection {
    nodes {
        id
        title
        handle
        productType
        ...ProductColorPreviewVariantField
       variants(first: 250) {
            nodes {
                id
                title
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
            }
        }
        options(first: 40) {
            id
            name
            optionValues {
                id
                name
            }
        }
        priceRange {
            maxVariantPrice {
                ...PriceFields 
            }
        }
    }
}

${e}
${a}
`,n=`#graphql
query GetProducts {
    products(first: 250) {
        ...ProductsConnectionField
    }
}

${t}
`,d=`#graphql
query GetCollectionProducts($id: ID!) {
    collection(id: $id) {
        id
        handle

        seo {
            title
            description
        }
        image { # For og:image
          url
        }

        products(first: 250) {
            ...ProductsConnectionField
        }
    }
}

${t}
`;export{n as a,d as c,l as p};
