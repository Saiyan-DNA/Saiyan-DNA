import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@mui/styles';

const BasicModal = loadable(() => import('../common/BasicModal' /* webpackChunkName: "General" */));
const TransactionDetail = loadable(() => import('./TransactionDetail' /* webpackChunkName: "Financial" */));

import { toggleTransactionModal } from "../../actions/transactions";

const styles = theme => ({
    numberFormat: {
        textAlign: "right"
    },
});

class TransactionModal extends React.Component {
    static propTypes = {
        transactionModalOpen: PropTypes.bool.isRequired,
        toggleTransactionModal: PropTypes.func.isRequired,
        currentTransaction: PropTypes.object
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const { transactionModalOpen, toggleTransactionModal, currentTransaction } = this.props;

        return (
            <BasicModal open={transactionModalOpen} onClose={toggleTransactionModal} title={currentTransaction ? "Edit Transaction" : "Add Transaction"}>
                <TransactionDetail  />
            </BasicModal>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    transactionModalOpen: state.transactions.transactionModalOpen,
    currentTransaction: state.transactions.currentTransaction
});

const mapDispatchToProps = {
    toggleTransactionModal
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})
    (TransactionModal));