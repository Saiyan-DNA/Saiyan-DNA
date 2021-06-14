import React from 'react';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Material" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Material" */));
const CardHeader = loadable(() => import('@material-ui/core/CardHeader' /* webpackChunkName: "Material" */));
const IconButton = loadable(() => import('@material-ui/core/IconButton' /* webpackChunkName: "Material" */));
const Modal = loadable(() => import('@material-ui/core/Modal' /* webpackChunkName: "Material" */));
const CloseSharp = loadable(() => import('@material-ui/icons/CloseSharp' /* webpackChunkName: "Icons" */));

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