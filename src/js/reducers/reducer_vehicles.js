import { SET_VEHICLES } from '../actions/index';

export default function(state = {}, action) {
    switch (action.type) {
    case SET_VEHICLES:
        return action.payload;
    }
    return state;
}
