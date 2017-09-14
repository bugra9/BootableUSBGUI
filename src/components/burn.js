import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import IconCd from 'material-ui/svg-icons/notification/disc-full';
import {white} from 'material-ui/styles/colors';
import AlertContainer from 'react-alert'

import { burn } from '../actions/system';
const { exec } = require('child_process');
class Burn extends React.Component {
  render () {
    return (
    <div>
      <RaisedButton
        disabled={this.props.loading}
        label={this.props.buttonLabel}
        style={{marginTop: 20}}
        labelStyle={{color: "rgb(0, 188, 212)"}}
        icon={<IconCd style={{color: "rgb(0, 188, 212)"}} />}
        fullWidth={true}
        onClick={this.props.burn}
      />
      <AlertContainer ref={a => this.props.alertNode(a)} />
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.system.loading,
  buttonLabel: (state.system.po['Start'])?state.system.po['Start'].msgstr[0]:"Start"
});

const mapDispatchToProps = (dispatch) => {
    return {
        alertNode: (v) => dispatch({ type: 'Alert_SET', data: v }),
        burn: (v) => dispatch(burn(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Burn);