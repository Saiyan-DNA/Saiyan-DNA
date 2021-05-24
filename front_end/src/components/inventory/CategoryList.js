import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Edit from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';

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

export default connect(mapStateToProps, { getCategories, getCategory, clearCategory, setTitle })(withStyles(styles, { withTheme: true })(CategoryList));