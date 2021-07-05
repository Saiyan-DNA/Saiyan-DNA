import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const MuiAlert = loadable(() => import('@material-ui/lab/Alert' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});
const Snackbar = loadable(() => import('@material-ui/core/Snackbar' /* webpackChunkName: "Material" */), {fallback: <div>&nbsp;</div>});

import { clearMessage } from '../../actions/messages';

const styles = theme => ({
    systemMessage: {
        marginTop: "2.75em",
        marginBottom: "1em",
        opacity: "0.8",
        filter: "alpha(opacity=80)"
    }
});

function Alert(props) {
    return <MuiAlert elevation = { 6 }
    variant = "filled" {...props }
    />;
}

class SystemMessage extends React.Component {
    state = {
        isVisible: false,
        width: null,
        height: null,
    }

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    static propTypes = {
        clearMessage: PropTypes.func.isRequired,
        message: PropTypes.object
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({isVisible: false});
        this.props.clearMessage();
    };

    componentDidUpdate() {
        const { message } = this.props;
        const { isVisible } = this.state;

        if (message && !isVisible) {
            this.setState({isVisible: true});
        }
        if (!message && isVisible) {
            this.setState({isVisible: false});
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        const { classes, message } = this.props;
        const { isVisible, width, height } = this.state;

        var anchor = null

        if (width < 600) {
            anchor = {vertical: "bottom", horizontal: "center"}
        } else {
            anchor = {vertical: "top", horizontal: "center"}
        }

        return ( 
            <Snackbar className={classes.systemMessage} open={isVisible} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={anchor}>
                { message && 
                    <Alert onClose={this.handleClose} severity={message.type}>
                        { message.title } 
                    </Alert>
                }
            </Snackbar>
        )
    }
}

const mapStateToProps = state => ({
    message: state.messages.messageDetail
})

export default connect(mapStateToProps, { clearMessage })(withStyles(styles, { withTheme: true })(SystemMessage));