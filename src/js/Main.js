import React, { Component } from 'react';

import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
// import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Select from 'grommet/components/Select';

import BusMap from './components/BusMap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setConfig, fetchRoute, fetchArrivals, fetchLines, setVehicles} from './actions/index';

class Main extends Component {

    componentWillMount() {
        this.props.fetchLines();
        this.props.setConfig();
    }

    selectHandler(event) {
        let line = event.value;
        let config = {
            line: line,
            direction: 'inbound'
        };
        this.props.setVehicles({});
        this.props.setConfig(config);
        this.props.fetchRoute(config);
        this.props.fetchArrivals(config);
    }

    render () {
        if (this.props.lines === []) return <div>Waiting for data</div>;
        return (
            <App centered={false}>
                <Box full={true}>
                    <Header direction='row'
                        justify='between'
                        pad={{horizontal: 'medium'}} >
                        <Title>
                          Busmap
                        </Title>
                        <Select placeHolder='Search'
                                inline={false}
                                options={this.props.lines.map(line => line.id)}
                                value={this.props.config.line}
                                onChange={this.selectHandler.bind(this)} />
                    </Header>
                    <BusMap />
                    <Footer primary={true}
                            appCentered={true} 
                            direction='column'
                            align='center'
                            pad='small'
                            colorIndex='grey-1' >
                        <p>
                             Made by TeaSea
                        </p>
                    </Footer>
                </Box>
          </App>
        );
    }
};

const mapDispatchToProps = (dispatch) => (
   bindActionCreators({setConfig, fetchRoute, fetchArrivals, fetchLines, setVehicles}, dispatch)
);

const mapStateToProps = ({config, lines}) => (
    {config, lines}
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
