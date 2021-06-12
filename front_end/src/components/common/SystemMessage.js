import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';

import { clearMessage } from '../../actions/messages';

const styles = theme => ({
    systemMessage: {
        marginTop: "2em"
    }
});

function Alert(props) {
    return <MuiAlert elevation = { 6 }
    variant = "filled" {...props }
    />;
}

class SystemMessage extends React.Component {
    state = {
        isVisible: false
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
        if (this.props.message && !this.state.isVisible) {
            this.setState({isVisible: true});
        }
        if (!this.props.message && this.state.isVisible) {
            this.setState({isVisible: false});
        }
    }

    render() {
        const { classes, message } = this.props;

        return ( 
            <Snackbar className={classes.systemMessage} open={this.state.isVisible} autoHideDuration={3000} onClose={this.handleClose} anchorOrigin={{vertical: "top", horizontal: "center"}}>
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