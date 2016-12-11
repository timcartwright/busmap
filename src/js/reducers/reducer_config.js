import { SET_CONFIG } from '../actions/index';

export default function(state = {}, action) {
    switch (action.type) {
    case SET_CONFIG:
        return action.payload;
    }
    return state;
}
