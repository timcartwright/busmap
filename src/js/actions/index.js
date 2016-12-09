import axios from 'axios';

const ROOT_URL = `https://api.tfl.gov.uk/`;

export const FETCH_STOP_POINTS = 'FETCH_STOP_POINTS';
export const FETCH_ROUTE = 'FETCH_ROUTE';
export const FETCH_ARRIVALS = 'FETCH_ARRIVALS';

export function fetchStopPoints(line='179') {
  const url = `${ROOT_URL}Line/${line}/StopPoints`;
  const request = axios.get(url);

  return {
    type: FETCH_STOP_POINTS,
    payload: request
  };
}

export function fetchRoute(line='179', direction='inbound') {
  const url = `${ROOT_URL}Line/${line}/Route/Sequence/${direction}`;
  const request = axios.get(url);

  return {
    type: FETCH_ROUTE,
    payload: request
  };
}

export function fetchArrivals(line='179') {
  const url = `${ROOT_URL}Line/${line}/Arrivals`;
  const request = axios.get(url);

  return {
    type: FETCH_ARRIVALS,
    payload: request
  };
}
