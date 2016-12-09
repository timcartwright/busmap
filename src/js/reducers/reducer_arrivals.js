import { FETCH_ARRIVALS } from '../actions/index';

export default function(state = [], action) {
    switch (action.type) {
    case FETCH_ARRIVALS:
        return action.payload.data || state;
    }
    return state;
}
