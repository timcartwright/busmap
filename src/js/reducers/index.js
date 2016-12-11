import { combineReducers } from 'redux';
import StopPointsReducer from './reducer_stop-points';
import RouteReducer from './reducer_route';
import ArrivalsReducer from './reducer_arrivals';
import ConfigReducer from './reducer_config';
import VehiclesReducer from './reducer_vehicles';

const rootReducer = combineReducers({
    stopPoints: StopPointsReducer,
    route: RouteReducer,
    arrivals: ArrivalsReducer,
    config: ConfigReducer,
    vehicles: VehiclesReducer
});

export default rootReducer;
