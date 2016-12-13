import { FETCH_LINES } from '../actions/index';

export default function(state = [], action) {
    switch (action.type) {
    case FETCH_LINES:
        return action.payload.data || state;
    }
    return state;
}
