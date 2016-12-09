import React, { Component } from 'react';
import { Map, TileLayer, Polyline } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchRoute, fetchArrivals } from '../actions/index';
import Vehicles from './Vehicles';
import StopPoints from './StopPoints';

class BusMap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchArrivals('179');
    this.props.fetchRoute('179');
  }

  getBounds(latLngList) {
    return ([
      [ Math.min.apply(Math,latLngList.map(latLng => latLng[0])),
        Math.min.apply(Math,latLngList.map(latLng => latLng[1]))  ],
      [ Math.max.apply(Math,latLngList.map(latLng => latLng[0])),
        Math.max.apply(Math,latLngList.map(latLng => latLng[1]))  ]
    ]);
  }

  render() {
    if (!this.props.route.lineStrings) return <div>Waiting for data</div>;
    let latLngList = JSON.parse(this.props.route.lineStrings[0])[0].map(item => item.reverse());
    return (
      <Map bounds={this.getBounds(latLngList)} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Polyline positions={latLngList} color='black' />
        <StopPoints />
        <Vehicles />
      </Map>
    );
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({fetchRoute, fetchArrivals}, dispatch)
);

const mapStateToProps = ({route}) => (
  {route}
);

export default connect(mapStateToProps, mapDispatchToProps)(BusMap);
