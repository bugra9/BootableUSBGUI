import React from 'react';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import {DropDownMenu, MenuItem} from 'material-ui/DropDownMenu' ;
import TextField from 'material-ui/TextField';

import { setMode, setFilesystem, setName } from '../actions/system';

class Advanced extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: false };
  }

  render () {

    return (
      <div>
      <Checkbox
          label={this.props.po('Advanced Options')}
          labelStyle={{color: "white"}}
          iconStyle={{fill: "white"}}
          checked={this.state.status}
          onCheck={() => this.setState({ status: !this.state.status })}
        />
      <DropDownMenu style={!this.state.status ? ({display: "none"}):{}} value={this.props.mode} labelStyle={{color: "white"}} onChange={(event, index, value) => this.props.setMode(value)}>
            <MenuItem value=" " primaryText={this.props.po('Partition Scheme and target system type')} />
            <MenuItem value="gpt_uefi" primaryText={this.props.po('%s partition scheme for UEFI', 'GPT')} />
            <MenuItem value="mbr_bios-uefi" primaryText={this.props.po('%s partition scheme for BIOS or UEFI', 'MBR')} />
            <MenuItem value="hybrid" primaryText={this.props.po('%s partition scheme for BIOS or UEFI', this.props.po("HYBRIT"))} />
            <MenuItem value="direct" primaryText={this.props.po('%s partition scheme', this.props.po("ISO Image"))} />
            <MenuItem disabled value="-" primaryText={this.props.po('%s partition scheme', this.props.po("Device"))} />
          </DropDownMenu>
      <DropDownMenu style={!this.state.status ? ({display: "none"}):{}} value={this.props.filesystem} labelStyle={{color: "white"}} onChange={(event, index, value) => this.props.setFilesystem(value)}>
        <MenuItem value=" " primaryText={this.props.po('File system')} />
        <MenuItem value="ntfs" primaryText="Ntfs"/>
        <MenuItem disabled value="ext4" primaryText="Ext4"/>
        <MenuItem disabled value="fat32" primaryText="Fat32"/>
      </DropDownMenu>
      <TextField
        style={!this.state.status ? ({display: "none"}):{top: -20, width: 'auto', paddingLeft: 24}}
        inputStyle={{color: 'white'}}
        floatingLabelStyle={{color: 'white'}}
        floatingLabelText={this.props.po('New volume label')}
        value={this.props.name}
        onChange={(event, value) => this.props.setName(value)}
    />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  mode: state.system.mode,
  filesystem: state.system.filesystem,
  name: state.system.name,
  po: (v, v1="", v2="", v3="") => {return require('util').format((state.system.po[v])?state.system.po[v]['msgstr'][0]:v, v1, v2, v3)}
});

const mapDispatchToProps = (dispatch) => {
    return {
        setMode: (v) => dispatch(setMode(v)),
        setFilesystem: (v) => dispatch(setFilesystem(v)),
        setName: (v) => dispatch(setName(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);