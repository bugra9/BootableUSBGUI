import React from 'react';
import { connect } from 'react-redux';
import {DropDownMenu, MenuItem} from 'material-ui/DropDownMenu' ;
import IconUsb from 'material-ui/svg-icons/device/usb';
import {white} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

import { setUsb, getDevices } from '../actions/system';

const { exec } = require('child_process');

const iconStyles = {
  width: 100,
  height: 100,
  verticalAlign: "middle"
};

class Usb extends React.Component {
  constructor(props) {
    super(props);
    props.getDevices();
  }
  render () {
    let temp = [];
    for(let val of this.props.devices)
        temp.push(<MenuItem key={val.split(" ").pop()} value={val} primaryText={val} />);
    return (
      <div>
      <IconUsb style={iconStyles} color={white} />
      <DropDownMenu value={this.props.usbName} style={{verticalAlign: "text-bottom"}} labelStyle={{color: "white"}} onChange={(event, index, value) => this.props.setUsb(value)}>
        <MenuItem value=" " primaryText={this.props.po('USB Storage Device')}/>
        {temp}
      </DropDownMenu>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  usbName: state.system.usbFullName,
  devices: state.system.usbDevices,
  po: (v) => {return (state.system.po[v])?state.system.po[v]['msgstr'][0]:v}
});

const mapDispatchToProps = (dispatch) => {
    return {
        setUsb: (v) => dispatch(setUsb(v)),
        getDevices: () => dispatch(getDevices())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Usb);