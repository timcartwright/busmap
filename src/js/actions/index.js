import axios from 'axios';

const ROOT_URL = `https://api.tfl.gov.uk/`;

export const FETCH_LINES = 'FETCH_LINES';
export const FETCH_STOP_POINTS = 'FETCH_STOP_POINTS';
export const FETCH_ROUTE = 'FETCH_ROUTE';
export const FETCH_ARRIVALS = 'FETCH_ARRIVALS';
export const SET_CONFIG = 'SET_CONFIG';
export const SET_VEHICLES = 'SET_VEHICLES';
export const DEFAULT_CONFIG = {line: '179', direction: 'inbound'};

export function fetchLines(mode='bus') {
    const url = `${ROOT_URL}Line/Mode/${mode}`;
    const request = axios.get(url);

    return {
        type: FETCH_LINES,
        payload: request
    };
}

export function fetchStopPoints(config=DEFAULT_CONFIG) {
    const url = `${ROOT_URL}Line/${config.line}/StopPoints`;
    const request = axios.get(url);

    return {
        type: FETCH_STOP_POINTS,
        payload: request
    };
}

export function fetchRoute(config=DEFAULT_CONFIG) {
    const url = `${ROOT_URL}Line/${config.line}/Route/Sequence/${config.direction}`;
    const request = axios.get(url);

    return {
        type: FETCH_ROUTE,
        payload: request
    };
}

export function fetchArrivals(config=DEFAULT_CONFIG) {
    const url = `${ROOT_URL}Line/${config.line}/Arrivals`;
    const request = axios.get(url);

    return {
        type: FETCH_ARRIVALS,
        payload: request
    };
}

export function setConfig(config=DEFAULT_CONFIG) {
    return {
        type: SET_CONFIG,
        payload: config
    };
}

export function setVehicles(vehicles={}) {
    return {
        type: SET_VEHICLES,
        payload: vehicles
    };
}
