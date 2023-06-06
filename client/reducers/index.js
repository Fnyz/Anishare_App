import {combineReducers} from 'redux';
import posts from './post';

const rootReducers = combineReducers({
    post: posts
})

export default rootReducers;