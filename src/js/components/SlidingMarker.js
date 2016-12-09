import { Marker } from 'react-leaflet';
import { connect } from 'react-redux';
import slideTo from 'leaflet.marker.slideto'; // eslint-disable-line no-unused-vars

class SlidingMarker extends Marker {
    constructor(props) {
        super(props);
    }

    startSliding() {
        const marker = this.leafletElement;
        marker.slideTo(	this.props.next, {
            duration: this.props.timeToStation * 1000,
            keepAtCenter: false
        });
    }

    componentDidUpdate() {
        this.startSliding();
    }

    componentDidMount() {
        super.componentDidMount();
        this.startSliding();
    }
}

const mapStateToProps = ({arrivals}) => (
    {arrivals}
);

export default connect(mapStateToProps)(SlidingMarker);
