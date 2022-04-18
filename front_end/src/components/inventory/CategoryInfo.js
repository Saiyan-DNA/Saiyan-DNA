import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button, Card, CardContent, Container, Grid, MenuItem, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';

import { setTitle } from '../../actions/navigation';

const styles = theme => ({});

class CategoryInfo extends React.Component {
    state = {
        id: 0,
        categoryName: "",
        description: "",
        parent: 0,
        children: [],
        categoryType: {},
        home: {},
        parentCategories: []
    }

    parentCategories = [];

    static propTypes = {
        category: PropTypes.object,
        categories: PropTypes.array.isRequired,
        setTitle: PropTypes.func.isRequired
    }

    populateParentCategories = (category) => {
        if (category.item_count > 0) {
            return
        }

        this.parentCategories.push({id: category.id, name: category.name});
        category.children.map(c => this.populateParentCategories(c));
    }

    componentDidMount() {
        if (this.props.category.id) {
            console.log(this.props.category);
            this.props.setTitle("Edit Category");

        } else {
            this.props.setTitle("Add Category");
        }

        this.props.categories.map(c => this.populateParentCategories(c));
        this.parentCategories.sort((a, b) => (a.name > b.name) ? 1 : -1);
        this.setState({...this.state, parentCategories: this.parentCategories});
    }

    componentDidUpdate() {
        if (this.props.category.id && (!this.state.id || this.props.category.id !== this.state.id)) {
            this.props.setTitle("Edit Category");
            
            this.setState({
                ...this.state,
                id: this.props.category.id,
                categoryName: this.props.category.name,
                description: this.props.category.description,
                parent: this.props.category.parent_category ? this.props.category.parent_category.id : 0,
                children: this.props.category.children,
                categoryType: this.props.category.category_type,
                home: this.props.category.home
            });
        }
    }

    onChange = (e) => {
        this.setState({...this.state, [e.target.name]: e.target.value});
    }

    saveCategory = () => {
        console.log("Saving Category...")
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;
        const { categoryName, description, parent, children, categoryType, home, parentCategories } = this.state;

        this.classes = classes;

        return (
            <Container>
                <form onSubmit={this.saveCategory}>
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item>
                            <Button variant="outlined" color="primary" size="small" onClick={this.goBack}>Back</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" size="small" onClick={this.saveCategory}>Save</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={4}>
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={6}>
                                            <TextField id="categoryName" name="categoryName" label="Category Name"
                                                variant="standard" required fullWidth value={categoryName} onChange={this.onChange} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField id="description" name="description" label="Description"
                                                variant="standard" fullWidth value={description} onChange={this.onChange} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField select id="parent" name="parent" label="Parent Category"
                                                variant="standard" fullWidth value={parent} onChange={this.onChange}>
                                                <MenuItem value="0"><em>None</em></MenuItem>
                                                {this.state.parentCategories.map(p => (
                                                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        )
    }

}

const mapStateToProps = state => ({
    category: state.inventory.currentCategory || {},
    categories: state.inventory.categories
});

export default connect(mapStateToProps, { setTitle })(withStyles(styles, { withTheme: true })(CategoryInfo));