//Reducer for userListPage
export const UserListReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true,
            }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'DELETE_REQUEST':
            return {
                ...state,
                loadingDelete: true,
                successDelete: false
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return {
                ...state,
                loadingDelete: false,
                
            };
        case 'DELETE_RESET':
            return { 
                ...state, 
                loadingDelete: false, 
                successDelete: false 
            };
        default:
            return state;
    }
}



//Reducer for UserEditePage
export const UserEditReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'UPDATE_REQUEST':
            return {
                ...state,
                loadingUpdate: true
            };
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loadingUpdate: false,
            };
        case 'UPDATE_FAIL':
            return {
                ...state,
                loadingUpdate: false,
            };
        default:
            return state

    }
}