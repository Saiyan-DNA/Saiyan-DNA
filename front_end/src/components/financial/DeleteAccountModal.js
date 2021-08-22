import React from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Navigation" */));
const Grid = loadable(() => import('@material-ui/core/Grid' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));

const DestructiveButton = loadable(() => import('../common/DestructiveButton' /* webpackChunkName: "General" */));
const BasicModal = loadable(() => import('../common/BasicModal' /* webpackChunkName: "General" */));

import { deleteAccount } from '../../actions/accounts';

const styles = theme => ({
    modalMessage: {
        paddingBottom: "1.5em",
        marginBottom: "0.5em",
        borderBottom: "0.1px solid dimgray"
    },
    modalMessageIndented: {
        marginTop: "1em",
        marginLeft: "2em"
    }
});

class DeleteAccountModal extends React.Component {
    static propTypes = {
        deleteAccount: PropTypes.func.isRequired,
    }

    deleteAccount = () => {
        const { deleteAccount, id, history } = this.props;

        deleteAccount(id);
        history.push("/financial/accounts");
    }

    render() {
        const { classes, open, onClose, accountName, organization } = this.props;

        return (
            <BasicModal open={open} onClose={onClose} title="Delete Account?">
                <div className={classes.modalMessage}>
                    <Typography variant="body1">Are you sure you want to delete this account?</Typography>
                    <Typography variant="body2" className={classes.modalMessageIndented}>
                        <>
                            {accountName}&nbsp;{organization && "(" + organization.name + ")"}
                        </>
                    </Typography>
                </div>
                <Grid container spacing={2} justify="flex-end">
                    <Grid item>
                        <Button variant="outlined" color="primary" size="small" onClick={onClose}>Cancel</Button>
                    </Grid>
                    <Grid item>
                        <DestructiveButton onClick={this.deleteAccount}>Delete</DestructiveButton>
                    </Grid>
                </Grid>
            </BasicModal>
        );
    }
}

export default connect(null, { deleteAccount })(withRouter(withStyles(styles, {withTheme: true})
    (DeleteAccountModal)));