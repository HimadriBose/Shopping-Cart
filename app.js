const iconCart = document.querySelector('.icon-cart')
const body = document.querySelector('body')
const closeButton = document.querySelector('.close')
const listProductHTML = document.querySelector('.listProduct')
const listCartHTML = document.querySelector('.listCart')
const iconCartSpan = document.querySelector('.icon-cart span')
let listProduct = []
let carts = []

iconCart.addEventListener('click' , (event) =>{
    body.classList.toggle('showCart')
})

closeButton.addEventListener('click', (event) => {
    body.classList.toggle('showCart')
}) 

listProductHTML.addEventListener('click' , (event) => {
    const positionClick = event.target

    if(positionClick.classList.contains('addCart')){
        const product_id = positionClick.parentElement.dataset.id
        addToCart(product_id)
    }
})

listCartHTML.addEventListener('click' , (event) => {
    const positionClick = event.target
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        const product_id = positionClick.parentElement.parentElement.dataset.id
        let type = 'minus'
        
        if(positionClick.classList.contains('plus')){
            type = 'plus'
        }
          changeQuantity(product_id,type)
    }
})

const changeQuantity = (product_id,type) => {
    const productPosition = carts.findIndex((value) => value.product_id == product_id)
    if(productPosition => 0 ){
        switch (type) {
            case 'plus':
                carts[productPosition].quantity +=1
                break;
        
            default:
                let valueChange = carts[productPosition].quantity - 1
                if(valueChange > 0){
                    carts[productPosition].quantity = valueChange
                }
                else{
                    carts.splice(productPosition,1)
                }
                break;
        }
    }
    addCartToHTML()  
    addCartToMemory() 
    
}

const addToCart = (product_id) => {
    const productPosition = carts.findIndex((value) => value.product_id == product_id)

    if(carts.length <= 0){
        carts = [
            {
                product_id : product_id,
                quantity : 1
            }
        ]
    }
    else if(productPosition < 0 ){
        carts.push({
            product_id : product_id,
            quantity : 1
        })
    }
    else{
        carts[productPosition].quantity +=1
    }
    addCartToHTML()
    addCartToMemory()
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = ``
    let totalQuantity = 0
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity
            const positionProduct = listProduct.findIndex((value) => value.id == cart.product_id) 
            const newCart = document.createElement('div')
            newCart.classList.add('item')
            newCart.dataset.id = cart.product_id
            newCart.innerHTML = 
            `
                <div class="imgage">
                    <img src="${listProduct[positionProduct].image}" alt="">
                </div>
                <div class="name">
                    ${listProduct[positionProduct].name}
                </div>
                <div class="tatalPrice">
                    $${listProduct[positionProduct].price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span> ${cart.quantity} </span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newCart)
        })
   
    }
    iconCartSpan.innerText = totalQuantity
}

const addCartToMemory = () => {
    localStorage.setItem('cart' , JSON.stringify(carts))
}

const addDataToHTML = () => {
    listProductHTML.innerHTML = ``
    if(listProduct.length > 0){
        listProduct.forEach(product => {
            const newProduct = document.createElement('div')
            newProduct.classList.add('item')
            newProduct.dataset.id = product.id
            newProduct.innerHTML = 
            `
                 <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price} </div>
                <button class="addCart">Add To Cart</button>
            `; 

            listProductHTML.appendChild(newProduct)
        })
    }
}

//initialize app
const initApp = () => {
    //fetch data from JSON 
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProduct = data
        addDataToHTML()

        if(localStorage.getItem('cart') ){
            carts = JSON.parse(localStorage.getItem('cart'))
        }
        addCartToHTML()
    })
}

initApp()