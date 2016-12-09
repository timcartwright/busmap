import { FETCH_ROUTE } from '../actions/index';

export default function(state = {}, action) {
    switch (action.type) {
    case FETCH_ROUTE:
        return action.payload.data || state;
    }
    return state;
}
