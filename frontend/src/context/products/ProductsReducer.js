// Poducts reducer for Homepage
export const ProductsReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


// Product reducer for ProductPage
export const ProductReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }

}
// Product reducer for ProductListPage 
export const ProductListReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { 
                ...state, 
                products: action.payload.products, 
                page: action.payload.page, 
                pages: action.payload.pages, 
                loading: false 
            };
        case 'FETCH_FAIL':
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
        case 'CREATE_REQUEST':
            return {
                ...state,
                loadingCreate: true
            };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false, 
            };
        case 'CREATE_FAIL':
            return {
                ...state,
                loadingCreate: false
            }
        default:
            return state;
    }

}



