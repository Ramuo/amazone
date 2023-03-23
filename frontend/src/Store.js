import {createContext, useReducer} from 'react';


export const Store = createContext(); 


const initialState = {
    //FOR USERINFO
    userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

    //FOR CART
    cart: {
        shippingAddress:  localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {},

        cartItems:  localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    },
};

function CartReducer(state, action){
    switch(action.type){
        case 'CART_ADD_ITEM':
            //add to cart
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id);

            // if  cartItems = existitem  is true  just add quantity of the item and if not then 
            const cartItems = existItem
            ? state.cart.cartItems.map((item) =>
                item._id === existItem._id ? newItem : item
                )
            : [...state.cart.cartItems, newItem]

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return {...state, cart:{...state.cart, cartItems}};
            case 'CART_REMOVE_ITEM':{
                const cartItems = state.cart.cartItems.filter(
                    (item) => item._id !== action.payload._id
                );

                localStorage.setItem('cartItems', JSON.stringify(cartItems));

                return {...state, cart: {...state.cart, cartItems}};
            }
            case 'USER_SIGNIN':
                return {...state, userInfo: action.payload}; 
            case 'SINGN_OUT':
                return {
                    ...state, 
                    userInfo: null,
                    cart: {
                        cartItems: [],
                        shippingAddress: {},
                    },
                };
            case 'SAVE_SHIPPING_ADDRESS':
                return {
                    ...state, 
                    cart: {
                        ...state.cart,
                        shippingAddress: action.payload,
                    },
                };
        default:
            return state;
    }
}

export function StoreProvider({children}){
    const [state, dispatch] = useReducer(CartReducer, initialState);
    const value = {state, dispatch};
    return <Store.Provider value={value}>
        {children}
    </Store.Provider>
}