import React, { Component } from 'react';

import App from 'grommet/components/App';
import Sidebar from 'grommet/components/Sidebar';
import Split from 'grommet/components/Split';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import FormFields from 'grommet/components/FormFields';
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
                <Split fixed={false}
                    flex="right">
                    <Sidebar colorIndex="neutral-1" size="small">
                        <Header pad="medium" direction="column" align="start">
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
                                <FormFields>
                                    <Select placeHolder='Search'
                                            inline={false}
                                            options={this.props.lines.map(line => line.id)}
                                            value={this.props.config.line}
                                            onChange={this.selectHandler.bind(this)} />
                                    <Heading tag="h2">
                                        Direction
                                    </Heading>  
                                    <FormField>
                                        <RadioButton id="inbound"
                                            name="inbound"
                                            label="Inbound"
                                            checked={true} />
                                        <RadioButton id="outbound"
                                            name="outbound"
                                            label="Outbound"
                                            checked={false} />
                                    </FormField>
                                </FormFields>
                            </Form>
                        </Box>
                        <Footer pad="medium" direction="column" align="start">
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
