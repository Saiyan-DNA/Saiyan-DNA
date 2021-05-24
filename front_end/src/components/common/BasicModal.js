import React from 'react';

import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CloseSharp from '@material-ui/icons/CloseSharp';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    modalWindow: {
        maxWidth: "400px",
        ['@media (max-width: 400px)']: {
            maxWidth: "320px"
        },
        marginTop: "100px",
        ['@media (max-height: 400px)']: {
            marginTop: "50px"
        },
        marginLeft: "auto",
        marginRight: "auto",        
        padding: theme.spacing(0, 0, 0),
        backgroundColor: theme.palette.primary.main, // theme.palette.background.paper,        
        boxShadow: theme.shadows[5]        
    },
    modalHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginTop: "0px",
        padding: theme.spacing(1,2,1)
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,        
    },
});


const BasicModal = ({classes, children, title, open, onClose}) => {
    return (
        <Modal open={open} onClose={onClose} disableBackdropClick={true}>
            <Card elevation={4} className={classes.modalWindow}>
                <CardHeader className={classes.modalHeader} 
                    title={title} 
                    action={
                    <IconButton aria-label="Close" onClick={onClose}>
                        <CloseSharp size="large" style={{color: "white"}}/>
                    </IconButton>
                    }/>
                <CardContent className={classes.modalContent}>
                    {children}
                </CardContent>
            </Card>              
        </Modal>
    )
}

export default withStyles(styles, {withTheme: true})(BasicModal);