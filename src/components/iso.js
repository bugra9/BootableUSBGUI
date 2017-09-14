import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import IconCd from 'material-ui/svg-icons/notification/disc-full';
import {white} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

import { setIso } from '../actions/system';

const iconStyles = {
  marginRight: 24,
  width: 100,
  height: 100,
  verticalAlign: "middle"
};

class Iso extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this)
  }
  handleFileChange(e) {
    let fileInput = e.target.files[0];
    if(!fileInput)
      return;
    this.props.setIso(fileInput);
  }
  render () {
    return (
      <div>
      <Divider style={{margin: 20, marginTop: 20, backgroundColor: "rgba(255, 255, 255, 0.6)"}} />
      <IconCd style={iconStyles} color={white} />
      <RaisedButton
        containerElement="label"
        icon={<IconCd />} // material-ui-icons
        label={this.props.isoName || this.props.po('ISO Image')}
        labelColor="white"
        primary>
        <input
          onChange={this.handleFileChange}
          style={{ display: 'none' }}
          type="file"
        />
      </RaisedButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isoName: state.system.isoName,
  po: (v) => {return (state.system.po[v])?state.system.po[v]['msgstr'][0]:v}
});

const mapDispatchToProps = (dispatch) => {
    return {
        setIso: (v) => dispatch(setIso(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Iso);