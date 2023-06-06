
initialize = {
    post: [],
}
const posts = (state = initialize , action) => {

    switch(action.type){
       
        case 'ADD_NEW_DOCS':
            console.log('New docs added!');
            return state;
        case 'ADD_ERROR':
            console.log('There was an error!');
            return state;

        case 'GET_DATA_LIST':
                console.log('DATAs!');
        return {
            ...state,
            lisdata: action.listing}
        case 'SEARCH_DATA':
                console.log('AquarData'+ action.data);
        return {
            ...state,
            search: action.data}
    
    default:
        return state;
    }

}

export default posts;