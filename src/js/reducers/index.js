import { combineReducers } from 'redux';
import StopPointsReducer from './reducer_stop-points';
import RouteReducer from './reducer_route';
import ArrivalsReducer from './reducer_arrivals';

const rootReducer = combineReducers({
  stopPoints: StopPointsReducer,
  route: RouteReducer,
  arrivals: ArrivalsReducer
});

export default rootReducer;
