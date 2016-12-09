import React, { Component } from 'react';
import { CircleMarker } from 'react-leaflet';
import { connect } from 'react-redux';

class StopPoints extends Component {
  constructor(props) {
    super(props);
  }

  renderStop(stop) {
    return (
      <CircleMarker key={stop.id} 
                    center={[stop.lat, stop.lon]}
                    radius={5}
                    color='#CC3333'
                    fill={true}
                    fillOpacity={1}
                    fillColor='white' />
    );
  }

  render() {
    if (!this.props.route.stopPointSequences) return <div>Waiting for data</div>;
    return (
        <div>{this.props.route.stopPointSequences[0].stopPoint.map(stop => this.renderStop(stop))}</div>
    );
  }
}

const mapStateToProps = ({route}) => (
  {route}
);

export default connect(mapStateToProps)(StopPoints);
