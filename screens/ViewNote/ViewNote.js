import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, BackHandler} from 'react-native';
import ShoppingItem from "./components/ShoppingItem";
import {connect} from 'react-redux';
import {deleteList, saveList, updateList} from "./actions";
import {bindActionCreators} from "redux";
import useGetList from "../../components/useGetList";
import {confirmation, destructive, primaryBtnColour} from "../globalStyles";

class ViewNote extends Component {

    state = {
        createNote: true,
        noteItems: [],
        noteTitle: '',
        edit: true,
        focusIndex: null,
        changesMade: false,
    };

    constructor(props) {
        super(props);

        this.setInState = this.setInState.bind(this);
        this.onBack = this.onBack.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onItemAdd = this.onItemAdd.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.onItemRemove = this.onItemRemove.bind(this);
        this.onItemUpdate = this.onItemUpdate.bind(this);
        this.setItemFocus = this.setItemFocus.bind(this);
        this.handleBackPress = this.handleBackPress.bind(this);
        this.saveAndExit = this.saveAndExit.bind(this);
    }

    componentDidMount(): void {
        const {location} = this.props;

        const createNote = typeof location.state === 'undefined';

        // are we viewing a note, or creating one?
        this.setState({
            createNote: createNote,
        });

        !createNote && this.getNoteInfo(location.state.UID);

        // listen for back button pressed
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    }

    componentWillUnmount(): void {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    }

    /**
     * Handles hardware back button pressed.
     *
     * @returns {boolean}
     */
    handleBackPress() {
        this.onBack();

        return true;
    }

    /**
     * Get's list's info and sets into state.
     *
     * @param listUID
     */
    getNoteInfo(listUID) {
        const {lists} = this.props;
        const list = useGetList(listUID, lists);

        this.setState({
            noteItems: list.Items,
            noteTitle: list.Title,
        });
    }

    /**
     * Handles field input.
     *
     * @param key
     * @param data
     */
    setInState(key, data) {
        this.setState({[key]: data})
    }

    /**
     * Validates list, takes appropriate action on validation.
     */
    onSave() {
        const {noteItems, noteTitle, createNote} = this.state;
        let alertMsg = "";

        if (noteTitle.length === 0) alertMsg += "The shopping list is not titled. Please add one.\n";
        if (noteItems.length === 0) alertMsg += "There are no items in the shopping list. Please add some.\n";
        if (alertMsg.length > 0) {
            Alert.alert("Something isn't right", alertMsg, [], {cancelable: true});
        } else {
            createNote ? this.saveList() : this.editList();
        }
    }

    /**
     * Save list in redux.
     */
    saveList() {
        const {noteItems, noteTitle, createNote} = this.state;

        this.props.saveList({
            UID: this.generateUID(),
            Title: noteTitle,
            Items: noteItems,

        });

        // update createNote state && update changesMade
        createNote && this.setState({
            createNote: false,
            changesMade: false,
        });
    }

    /**
     * Creates and returns an UID for a shopping list.
     */
    generateUID() {
        return Date.now();
    }

    /**
     * Update list in redux.
     */
    editList() {
        const {location, lists} = this.props;
        const {noteItems, noteTitle} = this.state;
        const listUID = location.state.UID;
        const index = useGetList(listUID, lists).Index;

        this.props.updateList([index, {Items: noteItems, Title: noteTitle, UID: listUID}]);
        // update changesMade
        this.setState({
            changesMade: false,
        })
    }

    /**
     * Handle going back to the previous route.
     */
    onBack() {
        const {changesMade} = this.state;

        // check if there are unsaved changes
        if (changesMade) {
            Alert.alert(
                "Unsaved changes",
                "Exiting now will destroy your changes",
                [
                    {text: 'Save and exit', onPress: () => this.saveAndExit()},
                    {text: 'Exit', onPress: () => this.back()},
                    {text: 'Cancel'},
                ]
            )
        } else {
            this.back();
        }
    }

    /**
     * Uses redux to go back in history.
     */
    back() {
        const {history} = this.props;
        history.goBack();
    }

    /**
     * Saves the updated list, then goes back.
     */
    saveAndExit() {
        this.editList();
        this.back();
    }

    /**
     * Add given item to noteItems.
     */
    onItemAdd(item) {
        const {noteItems} = this.state;

        let updatedItems = noteItems;
        updatedItems.push(item);

        // add item to state
        this.setState({
            noteItems: updatedItems,
            changesMade: true,
        });

    }

    /**
     * Prompts user to confirm deleting the list.
     *
     */
    onDelete() {
        Alert.alert(
            'Are you sure you want to delete this list?',
            null,
            [
                {text: 'Yes', onPress: () => this.deleteList()},
                {text: 'No'},
            ]
        );
    }

    /**
     * Delete current list.
     */
    deleteList() {
        const {lists, location} = this.props;
        const listToDelete = useGetList(location.state.UID, lists);

        this.props.deleteList(listToDelete.Index);
        // put user back on the home screen
        this.onBack();
    }

    /**
     * Remove item from the list.
     *
     * @param text
     * @param index
     */
    onItemRemove(text, index) {
        const {noteItems} = this.state;

        noteItems.splice(index, 1);
        this.setState({
            noteItems: noteItems,
            focusIndex: null,
            changesMade: true,
        });
    }

    /**
     * Update item's value within the local list.
     *
     * @param text
     * @param index
     */
    onItemUpdate(text, index) {
        const {noteItems} = this.state;
        let updatedNoteItems = noteItems;
        updatedNoteItems[index] = text;

        this.setState({
            noteItems: updatedNoteItems,
            focusIndex: null,
            changesMade: true,
        });
    }

    /**
     * Sets the focus index.
     *
     * @param index
     */
    setItemFocus(index) {
        this.setState({
            focusIndex: index,
        });
    }

    render() {
        const {noteTitle, noteItems, createNote, focusIndex, changesMade} = this.state;
        const back = '<';

        return (
            <View style={styles.container}>

                <View style={styles.headerContainer}>
                    <View style={styles.listTitleContainer}>
                        <Text style={styles.back} onPress={this.onBack}>{back}</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.setInState('noteTitle', text)}
                            value={noteTitle}
                            placeholder={"Title of list..."}
                        />
                    </View>
                    <View style={styles.controlContainer}>

                        <View style={styles.buttonSpacing}>
                            <Button
                                title={"Save"}
                                onPress={this.onSave}
                                color={changesMade ? confirmation : primaryBtnColour}
                            />
                        </View>

                        {createNote ?
                            null :
                            <View style={styles.buttonSpacing}>
                                <Button
                                    title={"Delete"}
                                    onPress={this.onDelete}
                                    color={destructive}
                                />
                            </View>
                        }
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                >
                    {noteItems.length >= 1 ? noteItems.map((item, index) => {
                            return (
                                <ShoppingItem
                                    item={item}
                                    key={index}
                                    isFocused={focusIndex === index}
                                    onItemFocus={() => this.setItemFocus(index)}
                                    onSave={this.onItemAdd}
                                    onRemove={(text) => this.onItemRemove(text, index)}
                                    onUpdate={(text) => this.onItemUpdate(text, index)}
                                    edit
                                />
                            )
                        })
                        : null
                    }
                    <ShoppingItem onSave={this.onItemAdd}/>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {},
    listTitleContainer: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    listTitle: {
        fontSize: 16,
        alignSelf: 'center',
    },
    textInput: {
        flex: 0.7,
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    buttonSpacing: {
        flex: 0.4,
    },
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        margin: 10,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    back: {
        flex: 0.1,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'grey',
        alignSelf: 'center',
    },
    contentContainer: {}
});

const mapStateToProps = (state) => {
    const {shoppingList} = state;
    return shoppingList;
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        saveList,
        deleteList,
        updateList,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ViewNote);