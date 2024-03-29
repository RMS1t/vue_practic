let eventBus = new Vue()

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
        
      <a :href="link">Like this</a>
 
        
      </div>
      
     <div style="display: flex; margin: auto auto ">    
        
        <product-tabs :reviews="reviews" :details="details" :shipping="shipping"></product-tabs>

         </div>
    
   </div> `,
    data() {
        return {
            product: "Socks",
            reviews: [],
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
    created() {
        eventBus.$on('review-submitted', function (productReview) {
            this.reviews.push(productReview)
        }.bind(this))
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

Vue.component('product-review', {
    template: `
   <form class="review-form" @submit.prevent="onSubmit">
   
   <p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label >Recommendation:</label>
   <label for="yes">Yes</label>
   <input type="radio" id='yes' name="recom" value="yes" v-model="recommendating"/>
   <label for="no">No</label>
   <input type="radio" id="no" name="recom" value="no" v-model="recommendating"/>

 </p>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendating:null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommendating) {

                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendating:this.recommendating,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendating = null
            } else {
                if(!this.recommendating ) this.errors.push(" recommendation required.")
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }


    }
    })

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review :rewiews="rewiews"></product-review>
       </div>
       <div v-show="selectedTab === 'Details'">
        <product-details :details="details"></product-details>
        </div>
       <div v-show="selectedTab === 'Shipping'">
          <p> Shipping : {{shipping}}</p>
       </div>
       
       
             
     </div>
`,


    data() {
        return {
            tabs: ['Reviews', 'Make a Review','Details','Shipping'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    },
    props: {
        reviews: {
            type: Array,
            required: false
        },
        details: {
            type: Array,
            required: true
        },
        shipping: {
            type: String,
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
        },


    }


})
