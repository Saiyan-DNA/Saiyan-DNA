import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import { withStyles } from '@material-ui/core/styles';

const Button = loadable(() => import('@material-ui/core/Button' /* webpackChunkName: "Navigation" */));
const Card = loadable(() => import('@material-ui/core/Card' /* webpackChunkName: "Layout" */));
const CardContent = loadable(() => import('@material-ui/core/CardContent' /* webpackChunkName: "Layout" */));
const Collapse = loadable(() => import('@material-ui/core/Collapse' /* webpackChunkName: "Material" */));
const Container = loadable(() => import('@material-ui/core/Container' /* webpackChunkName: "Layout" */));
const Typography = loadable(() => import('@material-ui/core/Typography' /* webpackChunkName: "Layout" */));
const IconButton = loadable(() => import('@material-ui/core/IconButton' /* webpackChunkName: "Material" */));
const List = loadable(() => import('@material-ui/core/List' /* webpackChunkName: "Material" */));
const ListItem = loadable(() => import('@material-ui/core/ListItem' /* webpackChunkName: "Material" */));
const ListItemIcon = loadable(() => import('@material-ui/core/ListItemIcon' /* webpackChunkName: "Material" */));
const ListItemText = loadable(() => import('@material-ui/core/ListItemText' /* webpackChunkName: "Material" */));

const ArrowRight = loadable(() => import('@material-ui/icons/ArrowRight' /* webpackChunkName: "Icons" */));
const ArrowDropDown = loadable(() => import('@material-ui/icons/ArrowDropDown' /* webpackChunkName: "Icons" */));
const Edit = loadable(() => import('@material-ui/icons/Edit' /* webpackChunkName: "Icons" */));


import { getCategories, getCategory, clearCategory } from '../../actions/categories';
import { setTitle } from '../../actions/navigation';

const styles = theme => ({
    hideForPrint: {
        ['@media print']: { // eslint-disable-line no-useless-computed-key
            display: "none",
        }
    },
    categoryDiv: {
        padding: 0, 
        margin: 0,
    },
    listItem: {
        flex: 1,
        justifyContent: "space-between",
        /*"&.Mui-selected": {
            backgroundColor: "rgb(0,0,0,0.6)",
            color: "rgb(255,255,255,1)"
          }*/
    },
    listItemText: {
        
    },
    listItemIcon: {
        minWidth: 32,
        maxWidth: 32
    },
    categoryList: {
        width: '100%',
    },
    listItemButton: {
        paddingRight: 2
    },
    itemCount: {
        color: "gray",
        verticalAlign: "middle",
        paddingRight: "2px"
    }
});

class CategoryList extends React.Component {
    state = {

    }

    constructor(props) {
        super(props);
    }

    static propTypes = {
        categories: PropTypes.array.isRequired,
        getCategories: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.setTitle("Categories");
        this.props.clearCategory();
        this.props.getCategories();
    }

    toggleCategory = (categoryId) => {
        this.setState({...this.state, [categoryId]: !this.state[categoryId]});
    }

    goToEdit = (event, category) => {
        event.preventDefault();
        this.props.getCategory(category.id) 
        this.props.history.push("/inventory/categoryinfo");
    }

    itemCount(itemQty) {
        return (
            <span className={this.classes.itemCount}>Items: {itemQty}</span>
        )
    }

    categoryTree(category, index) {
        if (category.children.length > 0) {
            return (
                <div key={category.id} className={this.classes.categoryDiv} style={{paddingLeft: (category.level*32) }}>
                    <ListItem key={category.id} button divider className={this.classes.listItem}
                        style={index % 2 ? {background: "#f5f7f7"} : {background: "#ffffff"}}>
                        <ListItemIcon className={this.classes.listItemIcon}
                            onClick={() => (this.toggleCategory(category.id))}>{ this.state[category.id] ? <ArrowDropDown /> : <ArrowRight /> }</ListItemIcon>
                        <ListItemText className={this.classes.listItemText}
                            onClick={() => (this.toggleCategory(category.id))}>{category.name}</ListItemText>
                        <div>{category.extended_item_count ? this.itemCount(category.extended_item_count) : null }
                        <IconButton className={this.classes.listItemButton} size="small"
                            onClick={(e) => this.goToEdit(e, category)}><Edit/></IconButton>
                        </div>
                    </ListItem>
                    <Collapse key={category.id + "_children"} in={this.state[category.id]} unmountOnExit>
                        <List style={{margin:0, padding: 0}}>
                            {category.children.map((child, index) => (this.categoryTree(child, index)))}
                        </List>
                    </Collapse>
                </div>
            )
        } else {
            return (
                <div key={category.id} className={this.classes.categoryDiv} style={{paddingLeft: (category.level*32) }}>
                    <ListItem key={category.id} button divider className={this.classes.listItem}
                        style={index % 2 ? {background: "#f5f7f7"} : {background: "#ffffff"}}>
                        <ListItemIcon className={this.classes.listItemIcon} />
                        <ListItemText className={this.classes.listItemText}>{category.name}</ListItemText>
                        <div>{category.extended_item_count ? this.itemCount(category.extended_item_count) : null }
                        <IconButton className={this.classes.listItemButton} size="small"
                            onClick={(e) => this.goToEdit(e, category)}><Edit /></IconButton>
                        </div>
                    </ListItem>
                </div>
            )
        }
    }

    render() {
        const { classes } = this.props;
        this.classes = classes;

        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} align="right">
                        <Button variant="contained" color="primary" size="small"
                        onClick={() => this.props.history.push("/inventory/categoryinfo")}>Add Category</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <List className={this.classes.categoryList}>
                                    {
                                        this.props.categories.map((category, index) => this.categoryTree(category, index))
                                    }                           
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        )
    }

}

const mapStateToProps = state => ({
    categories: state.inventory.categories || []
});

const mapDispatchToProps = {
    getCategories,
    getCategory,
    clearCategory,
    setTitle
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CategoryList));