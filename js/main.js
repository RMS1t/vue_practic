

Vue.component( 'product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">

      <div class="product-image">
        <img :src="image" :alt="altText" />
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>


        <div :class="[inStock,{ sharped_text: !inStock }]">

          <p v-if="inStock>0">In stock</p>
          <p v-else>Out of stock</p>


        </div>


        <span  v-show="onSale" >{{sale}} </span>
        <p>Shipping: {{ shipping }}</p>

        <product-details :details="details"></product-details>
      

        <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
        ></div>


        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <button
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"

        >
          Add to cart
        </button>
        <button
                v-on:click="removeToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"

        >
          Rem. product
        </button>
      </div>
      <a :href="link">Like this</a>
    </div>

   </div> `,
    data() {
        return {
            product: "Socks",

            altText: "A pair of socks",
            link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",

            inventory: 100,
            onSale: true,
            brand: 'Vue Mastery',
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            selectedVariant: 0,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],


            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            return this.brand  + ' ' + this.product + " On Sale"
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }


    },

    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },


        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId );
        },
        removeToCart() {
            this.$emit('remove-to-cart',this.variants[this.selectedVariant].variantId);
             ;
        }

    },

})

Vue.component( 'product-details',{
    template:`
    <ul>
   <li v-for="detail in details">{{ detail }}</li>
    </ul>
`,
    props: {
        details: {
            type: Array,
            required: true
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        upCart(id) {
            this.cart.push(id);
        },
        downCart(id) {
            this.cart= this.del_by_id(this.cart, id);
        },
        del_by_id(arr,id){
            for ( let i= 0; i< arr.length; i++){
                if (arr[i] === id){
                    arr.splice(i,1)
                }
            }
            return arr
        }

    }


})
