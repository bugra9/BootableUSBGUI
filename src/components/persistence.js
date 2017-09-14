import React from 'react';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import {DropDownMenu, MenuItem} from 'material-ui/DropDownMenu' ;

class Persistence extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: false, status2: false };
  }

  render () {

    return (
      <div>
      <Divider style={{margin: 20, marginTop: 20, backgroundColor: "rgba(255, 255, 255, 0.6)"}} />
      <Checkbox
        label={this.props.po('Persistent Storage')}
        labelStyle={{color: "white"}}
        iconStyle={{fill: "white"}}
        checked={this.state.status}
        onCheck={() => this.setState({ status: !this.state.status })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  po: (v) => {return (state.system.po[v])?state.system.po[v]['msgstr'][0]:v}
});


export default connect(mapStateToProps)(Persistence);