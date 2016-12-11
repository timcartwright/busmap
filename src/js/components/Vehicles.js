import React, { Component } from 'react';
import { Popup } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchArrivals, setVehicles } from '../actions/index';
import moment from 'moment'; 
import SlidingMarker from './SlidingMarker';
import Leaflet from 'leaflet';

import $ from 'jquery';
window.jQuery = $;
require('ms-signalr-client');
//
class Vehicles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cannotFetchArrivalsBefore: null
        };
    }

    componentWillMount() {
        this.setState({cannotFetchArrivalsBefore: moment().add(10, 'seconds')});
    }

    componentDidMount() {
        this.setVehiclesState(this.props.arrivals, true);
        this.subscribeToLiveData(this.props.config.line);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.subscribeToLiveData(nextProps.config.line);
        }
        if (nextProps.arrivals !== this.props.arrivals) {
            this.setVehiclesState(nextProps.arrivals, true);
        }
    }

    setVehiclesState(arrivals, flushData=false) {
        let cannotFetchArrivalsBefore = this.state.cannotFetchArrivalsBefore;
        let vehicles = flushData ? {} : this.props.vehicles;
        let stateChangePending = false;
        
        arrivals.forEach(arrival => {
            try {
                let vehicle = arrival.vehicleId = arrival.vehicleId || arrival.VehicleId;
                arrival.timeToStation = arrival.timeToStation || arrival.TimeToStation;
                arrival.direction = arrival.direction || arrival.Direction;
                arrival.lineId = arrival.lineId || arrival.LineId;
                if (
                    (   
                        !vehicles[vehicle] ||
                        arrival.timeToStation < vehicles[vehicle].timeToStation ||
                        (vehicles[vehicle].stationStopPoint.oneAfterNext && moment().isAfter(moment(vehicles[vehicle].expectedArrival)) && arrival.NaptanId === vehicles[vehicle].stationStopPoint.oneAfterNext.id)
                    ) &&
                        arrival.lineId === this.props.config.line &&
                        arrival.direction === this.props.config.direction &&
                        arrival.timeToStation < 300
                ) {
                    vehicles[vehicle] = this.processArrivalData(arrival);
                    stateChangePending = true;
                } else if (
                    vehicles[vehicle] && moment().isAfter(moment(vehicles[vehicle].timeToLive)) && moment().isAfter(cannotFetchArrivalsBefore)
                ) {
                    this.setState({cannotFetchArrivalsBefore: moment().add(10, 'seconds')});
                    this.props.fetchArrivals(this.props.config);
                }
            } catch(err) {
                console.log(err.name, err.message);
            } 
        });

        if (stateChangePending) {
            this.props.setVehicles(vehicles);
        } 

        return true;
    }

    subscribeToLiveData(line) {
        const TFL_SIGNALR_API = "https://push-api.tfl.gov.uk/signalr/hubs/signalr";
        const connection = $.hubConnection(TFL_SIGNALR_API);
        const predictionsRoomHubProxy = connection.createHubProxy('predictionsRoomHub');
        predictionsRoomHubProxy.on('showPredictions', this.setVehiclesState.bind(this));

        // attempt connection, and handle errors
        connection.start()
            .done(selectLineRooms.bind(this))
            .fail(function() {
                console.log('Could not connect');
            });

        function selectLineRooms() {
            console.log('Now connected, connection ID=' + connection.id);
            var lineRooms = [{ "LineId": this.props.config.line }];
            predictionsRoomHubProxy.invoke('addLineRooms',lineRooms)
                .done(function () {
                    console.log("tfl.predictions: Invocation of addLineRooms succeeded");
                    return;
                })
                .fail(function (error) {
                    console.log("tfl.predictions: Invocation of addLineRooms failed. Error: " + error);
                    return;
                });
        };
    };

    processArrivalData(arrival) {
        console.log('processArrivalData');
        let naptanId = arrival.NaptanId || arrival.naptanId;
        return {
            vehicleId: arrival.vehicleId,
            naptanId: naptanId,
            timeToStation: arrival.timeToStation,
            bearing: arrival.Bearing || arrival.bearing,
            expectedArrival: arrival.expectedArrival || arrival.ExpectedArrival,
            timeToLive: arrival.timeToLive || arrival.TimeToLive,
            stationStopPoint: this.getStopPoint(naptanId)
        };
    }
    
    getStopPoint(naptanId) {
        let stopPoints = this.props.route.stopPointSequences[0].stopPoint;
        for(let i=0; i<stopPoints.length; i++) {
            if (stopPoints[i].id === naptanId) {
                return  {
                    next: stopPoints[i],
                    previous: stopPoints[i-1] || stopPoints[i],
                    oneAfterNext: stopPoints[i+1] || stopPoints[i]
                };
            } 
        }
    }

    renderVehicles() {
        var returnValue = [];
        for (let vehicle in this.props.vehicles) {
            returnValue.push(this.renderVehicle(this.props.vehicles[vehicle]));
        }
        return returnValue;
    }

    renderVehicle(vehicle) {
        const myIcon = Leaflet.icon({
            iconUrl: '/img/bus-icon.png',
            iconSize: [40,40]
        });
        if (!vehicle.stationStopPoint) return;
        return (   
            <SlidingMarker  key={vehicle.vehicleId}
                            icon={myIcon}
                            timeToStation={vehicle.timeToStation}
                            next={[vehicle.stationStopPoint.next.lat, vehicle.stationStopPoint.next.lon]} 
                            position={[vehicle.stationStopPoint.previous.lat, vehicle.stationStopPoint.previous.lon]} >
            <Popup>
                <span>{`${vehicle.vehicleId} will arrive at ${vehicle.stationStopPoint.next.name} ${moment(vehicle.expectedArrival).fromNow()}`}</span>
            </Popup>
            </SlidingMarker>
        );
    }

    render() {
        if (!this.props.arrivals || this.props.arrivals.length === 0 || this.props.vehicles === {}) return <div>Waiting for data</div>;
        return (
            <div>
                {this.renderVehicles()}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({fetchArrivals, setVehicles}, dispatch)
);

const mapStateToProps = ({route, arrivals, config, vehicles}) => (
    {route, arrivals, config, vehicles}
);

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);
