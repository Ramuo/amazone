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
    switch (action.type) {
        case 'FETCH_REQUEST':
          return { ...state, loading: true };
        case 'FETCH_SUCCESS':
          return {
            ...state,
            products: action.payload.products,
            page: action.payload.page,
            pages: action.payload.pages,
            loading: false,
          };
        case 'FETCH_FAIL':
          return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
          return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
          return {
            ...state,
            loadingCreate: false,
          };
        case 'CREATE_FAIL':
          return { ...state, loadingCreate: false };
    
        case 'DELETE_REQUEST':
          return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
          return {
            ...state,
            loadingDelete: false,
            successDelete: true,
          };
        case 'DELETE_FAIL':
          return { ...state, loadingDelete: false, successDelete: false };
    
        case 'DELETE_RESET':
          return { ...state, loadingDelete: false, successDelete: false };
        default:
          return state;
      }

}

// Product reducer for ProductEditPage 
export const ProductEditReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
          return { 
            ...state, 
            loading: true 
        };
        case 'FETCH_SUCCESS':
          return { 
            ...state, 
            loading: false 
        };
        case 'FETCH_FAIL':
          return {
             ...state, 
             loading: false, 
             error: action.payload 
            };
        case 'UPDATE_REQUEST':
          return { 
            ...state, 
            loadingUpdate: true 
        };
        case 'UPDATE_SUCCESS':
          return {
             ...state, 
             loadingUpdate: false
            };
        case 'UPDATE_FAIL':
          return { 
            ...state, 
            loadingUpdate: false 
        };
        case 'UPLOAD_REQUEST':
          return { 
            ...state, 
            loadingUpload: true, 
            errorUpload: '' };
        case 'UPLOAD_SUCCESS':
          return {
            ...state,
            loadingUpload: false,
            errorUpload: '',
          };
        case 'UPLOAD_FAIL':
          return { 
            ...state, loadingUpload: false, 
            errorUpload: action.payload 
        };
    
        default:
          return state;
      }
}



