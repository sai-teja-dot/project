import React, {Component} from 'react';
import {View, Dimensions, AsyncStorage, ActivityIndicator, Picker} from 'react-native';
import {VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryBar} from 'victory-native'
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedValue: '',
            width: 0
        }
    }

    componentWillMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedValue !== this.state.selectedValue) {
            const value = await AsyncStorage.getItem('data');
            const data = JSON.parse(value);
            let width = 0;
            if (this.state.selectedValue === "daily") {
                Axios({
                    method: "GET",
                    url: "https://api.fluxgen.in/aquagen/v1/industries/" + data.data.industry_id + "/consumption/graph?duration=daily&category=Domestic",
                    headers: {
                        "Authorization": data.data.token
                    }
                }).then(res => res.data).then(res => {
                    var list = [];
                    Object.values(res.data).map((value, key) => {
                        Object.keys(value).map(item => {
                            width += 100;
                            list.push({x: item, y: value[item].process_consumption})
                        })
                    })
                    this.setState({data: list})
                    this.setState(({width: width}))
                });
            }
            if (this.state.selectedValue === "weekly") {
                Axios({
                    method: "GET",
                    url: "https://api.fluxgen.in/aquagen/v1/industries/" + data.data.industry_id + "/consumption/graph?duration=weekly&category=Domestic",
                    headers: {
                        "Authorization": data.data.token
                    }
                }).then(res => res.data).then(res => {
                    var list = [];
                    Object.values(res.data).map((value, key) => {
                        Object.keys(value).map(item => {
                            width += 100;
                            list.push({x: item, y: value[item].process_consumption})
                        })
                    })
                    this.setState({data: list})
                    this.setState(({width: width}))
                });
            }
            if (this.state.selectedValue === "monthly") {
                Axios({
                    method: "GET",
                    url: "https://api.fluxgen.in/aquagen/v1/industries/" + data.data.industry_id + "/consumption/graph?duration=thismonth&category=Domestic",
                    headers: {
                        "Authorization": data.data.token
                    }
                }).then(res => res.data).then(res => {
                    var list = [];
                    Object.values(res.data).map((value, key) => {
                        Object.keys(value).map(item => {
                            width += 100;
                            list.push({x: item, y: value[item].process_consumption})
                        })
                    })
                    this.setState({data: list})
                    this.setState(({width: width}))
                });
            }
        }
    }

    async componentDidMount() {


    }

    render() {
        const {data, selectedValue} = this.state;
        console.log(this.state.width);
        const widht = Dimensions.get('screen').width;
        return (
            <View>
                <Picker
                    selectedValue={selectedValue}
                    style={{height: 50, width: 150}}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectedValue: itemValue})}
                >
                    <Picker.Item label="Daily" value="daily"/>
                    <Picker.Item label="Weekly" value="weekly"/>
                    <Picker.Item label="Monthly" value="monthly"/>
                </Picker>
              <ScrollView horizontal width={widht} style={{marginTop : 50}}>
                    {
                        Object.values(data).length === 0 ?
                            <ActivityIndicator size="large" color="#0000ff"/>
                            : <VictoryChart animate
                                            width={widht + this.state.width}
                                            domainPadding={40}
                                            theme={VictoryTheme.material}>
                                <VictoryBar
                                    data={data}
                                />
                            </VictoryChart>

                    }


                </ScrollView>
            </View>
        );

    }
}

export default Chart;
