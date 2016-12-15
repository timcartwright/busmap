import React, { Component } from 'react';

import App from 'grommet/components/App';
import Sidebar from 'grommet/components/Sidebar';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import FormField from 'grommet/components/FormField';
import Form from 'grommet/components/Form';
import RadioButton from 'grommet/components/RadioButton';
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

    handleLineChange(event) {
        this.setProps({
            line: event.value,
            direction: this.props.config.direction
        });
    }

    handleDirectionChange(event) {
        this.setProps({
            line: this.props.config.line,
            direction: event.target.value
        });
    }

    setProps(config) {
        this.props.setVehicles({});this.props.setConfig(config);
        this.props.fetchRoute(config);
        this.props.fetchArrivals(config);
    }

    render () {
        if (this.props.lines === []) return <div>Waiting for data</div>;
        return (
            <App centered={false}>
                <Split fixed={false}
                    flex="right" onResponsive={columns => console.log(columns)}>
                    <Sidebar colorIndex="neutral-1" size="small">
                        <Header pad="small" direction="column" align="start">
                            <Title>
                                BusMapper
                            </Title>
                            <Heading tag="h6">
                                Live London Bus Map
                            </Heading>
                        </Header>
                        <Box flex="grow"
                            justify="start">
                            <Form pad="small">
                                <Heading tag="h2">
                                    Bus Number
                                </Heading>
                                <Select placeHolder='Search'
                                        inline={false}
                                        options={this.props.lines.map(line => line.id)}
                                        value={this.props.config.line}
                                        onChange={this.handleLineChange.bind(this)} />
                                <Heading tag="h2">
                                    Direction
                                </Heading>  
                                <FormField>
                                    <RadioButton id="inbound"
                                        name="inbound"
                                        label="Inbound"
                                        value="inbound"
                                        checked={this.props.config.direction === 'inbound'}
                                        onChange={this.handleDirectionChange.bind(this)} />
                                    <RadioButton id="outbound"
                                        name="outbound"
                                        label="Outbound"
                                        value="outbound"
                                        checked={this.props.config.direction === 'outbound'}
                                        onChange={this.handleDirectionChange.bind(this)} />
                                </FormField>
                            </Form>
                        </Box>
                        <Footer pad="small" direction="column" align="start">
                            <Paragraph size="medium">
                                BusMapper is a live bus map that uses data from the TFL API to estimate the location and movement of London buses.
                            </Paragraph>
                            <Anchor href="//teasea.uk"
                                className="active">
                                Made by TeaSea
                            </Anchor>
                                
                        </Footer>
                    </Sidebar>
                    <Box colorIndex="neutral-2"
                        justify="center"
                        align="center">
                        <BusMap />
                    </Box>
                </Split>
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
