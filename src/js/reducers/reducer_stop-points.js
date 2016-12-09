import { FETCH_STOP_POINTS } from '../actions/index';

export default function(state = [], action) {
    switch (action.type) {
    case FETCH_STOP_POINTS:
        return action.payload.data || state;
    }
    return state;
}
