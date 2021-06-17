import React from 'react';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Box = loadable(() => import('@material-ui/core/Box' /* webpackChunkName: "Material" */))
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const CardHeader = loadable(() => import('@material-ui/core/CardHeader' /* webpackChunkName: "Layout" */));
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
        backgroundColor: theme.palette.primary.main,      
        boxShadow: theme.shadows[5]        
    },
    modalHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: "0px 8px 0px 16px !important",
    },
    modalAction: {
        marginTop: "auto !important",
        marginBottom: "auto !important",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,        
    },
    closeButton: {
        color: "#FFFFFF"
    }
});


const BasicModal = ({classes, children, title, open, onClose}) => {
    return (
        <Modal open={open} onClose={onClose} disableBackdropClick={true}>
            <Card elevation={4} className={classes.modalWindow}>
                <CardHeader classes={{root: classes.modalHeader, action: classes.modalAction}} 
                    title={title} 
                    action={
                        <Box>
                            <IconButton aria-label="Close" onClick={onClose}>
                                <CloseSharp size="large" className={classes.closeButton}/>
                            </IconButton>
                        </Box>
                    }/>
                <CardContent className={classes.modalContent}>
                    {children}
                </CardContent>
            </Card>              
        </Modal>
    )
}

export default withStyles(styles, {withTheme: true})(BasicModal);