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
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Play from 'grommet/components/icons/base/PlayFill';
import Update from 'grommet/components/icons/base/Update';

import BusMap from './components/BusMap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setConfig, fetchRoute, fetchArrivals, fetchLines, setVehicles} from './actions/index';

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            line: '179',
            controlsAreOpen: true
        };
    }

    componentWillMount() {
        this.props.fetchLines();
        this.props.setConfig();
    }

    openControls() {
        this.setState({controlsAreOpen: true});
    }

    handleLineChange(event) {
        event.preventDefault();
        let line = event.target.value;
        this.setState({line});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitLine();
    }

    submitLine(direction=this.props.config.direction) {
        let lines = this.props.lines.map(line => line.id);
        if (lines.includes(this.state.line)) {
            this.setProps({
                line: this.state.line,
                direction
            });
        }
        this.setState({controlsAreOpen: false});
    }

    handleDirectionChange(event) {
        this.submitLine(event.target.value);
    }

    setProps(config) {
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
                    flex="right"
                    priority={this.state.controlsAreOpen ? 'left' : 'right'} 
                    onResponsive={columns => console.log(columns)}>
                    <Sidebar colorIndex="neutral-1" size="small">
                        <Header pad="small" direction="column" align="start">
                            <Title>
                                BusMapper
                            </Title>
                            <Heading tag="h6">
                                Live London Bus Map
                            </Heading>
                        </Header>
                        <Box    flex="grow"
                                justify="start">
                            <Form   pad="small"
                                    onSubmit={::this.handleSubmit}>
                                <Heading tag="h2">
                                    Bus Number
                                </Heading>
                                <TextInput
                                        className="line-input"
                                        value={this.state.line}
                                        onDOMChange={::this.handleLineChange} />
                                <Button icon={<Play />}
                                        onClick={::this.handleSubmit} />
                                <Heading tag="h2">
                                    Direction
                                </Heading>  
                                <FormField>
                                    <RadioButton id="inbound"
                                        name="inbound"
                                        label="Inbound"
                                        value="inbound"
                                        checked={this.props.config.direction === 'inbound'}
                                        onChange={::this.handleDirectionChange} />
                                    <RadioButton id="outbound"
                                        name="outbound"
                                        label="Outbound"
                                        value="outbound"
                                        checked={this.props.config.direction === 'outbound'}
                                        onChange={::this.handleDirectionChange} />
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
                        <Button className="button__menu"
                                icon={<Update />}
                                primary={true}
                                onClick={::this.openControls} />
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
