import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, Button} from 'react-native';
import NoteCard from "./components/NoteCard";
import {connect} from "react-redux";
import {primaryBtnColour} from "../globalStyles";

class ViewNotes extends Component {

    constructor(props) {
        super(props);

        this.onCardPress = this.onCardPress.bind(this);
        this.onAddNew = this.onAddNew.bind(this);
    }

    /**
     * Routes user to viewing a particular list.
     *
     * @param item
     */
    onCardPress(item) {
        const {history} = this.props;

        // route to list view
        history.push({
            pathname: '/view',
            state: { UID: item.UID },
        });
    }

    /**
     * Routes user to create a new list.
     */
    onAddNew() {
        const {history} = this.props;
        history.push('view/');
    }

    render() {
        const {lists} = this.props;

        console.log('all lists:', lists);

        return (
            <View style={styles.container}>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Shopping List</Text>
                </View>

                <View style={styles.controlsContainer}>
                    <Button title={"+ Add New"} onPress={this.onAddNew} color={primaryBtnColour}/>
                </View>

                {lists ?
                    (<ScrollView contentContainerStyle={styles.contentContainer}>
                        {lists.map((data, index) => (
                            <NoteCard data={data} key={index} onCardPress={() => this.onCardPress(data)}/>
                        ))}
                    </ScrollView>)
                    : null}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        margin: 10,
        borderBottomWidth: 1,
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    controlsContainer: {
        margin: 10,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
});

const mapStateToProps = state => {
    return ({lists: state.shoppingList.lists});
};

export default connect(mapStateToProps)(ViewNotes);





