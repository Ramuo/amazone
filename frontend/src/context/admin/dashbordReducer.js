//Reducer for dashbordPage
export const DashbordReducer = (state, action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
}