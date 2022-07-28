import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

class ColoredCircularProgress extends Component {
    render() {
        const { classes } = this.props;
        return <CircularProgress {...this.props} classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }} />;
    }
}

const styles = props => ({
    colorPrimary: {
        backgroundColor: 'transparent',
        color: '#9CE142'
    },
});

export default withStyles(styles)(ColoredCircularProgress);