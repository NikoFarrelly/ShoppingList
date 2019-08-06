import React, {useState, useEffect} from "react";
import {View, Button, StyleSheet, TextInput} from 'react-native';
import {destructive, primaryBtnColour} from "../../globalStyles";

const ShoppingItem = ({item, onSave, onRemove, onUpdate, isFocused, onItemFocus, edit}) => {

    const [text, setText] = useState(item ? item : '');
    const [inputRef, setInputRef] = useState(null);

    const onAddHandler = () => {
        if (typeof text !== 'undefined' && text.length >= 1) {
            onSave(text);
            setText('');
            !edit && inputRef.focus();
        }
    };

    const onRemoveHandler = () => {
        onRemove(text);
    };

    const onUpdateHandler = () => {
        onUpdate(text);
    };

    const onFocus = () => {
        onItemFocus();
    };

    let textInputStyles = isFocused ? styles.focusedTextInput : styles.textInput;
    let buttonContainerStyles = isFocused ? styles.focusedButtonContainer : styles.buttonContainer;

    /**
     * Change styling when component is in focus.
     */
    useEffect(() => {
        textInputStyles = isFocused ? styles.focusedTextInput : styles.textInput;
        buttonContainerStyles = isFocused ? styles.focusedButtonContainer : styles.buttonContainer;
    }, [isFocused]);

    /**
     * If text has been updated, reflect that change.
     */
    useEffect(() => {
        setText(item);
    }, [item]);

    return (
        <View style={styles.container}>
            {edit ?
                <TextInput
                    onChangeText={(text) => setText(text)}
                    value={text}
                    style={textInputStyles}
                    onFocus={onFocus}
                    onSubmitEditing={onUpdateHandler}
                />
                :
                <TextInput
                    onChangeText={(text) => setText(text)}
                    value={text}
                    style={textInputStyles}
                    placeholder={"new item..."}
                    onSubmitEditing={onAddHandler}
                    blurOnSubmit={false}
                    ref={(ref) => setInputRef(ref)}
                />
            }
            <View style={buttonContainerStyles}>
                {edit ?
                    null
                    :
                    <Button
                        title={"Add"}
                        onPress={(e) => onAddHandler(e)}
                        color={primaryBtnColour}
                    />
                }

                {isFocused ?
                    <View style={styles.row}>

                        <View style={styles.buttonSpacing}>
                            <Button
                                title={"Update"}
                                onPress={(e) => onUpdateHandler(e)}
                                color={primaryBtnColour}
                            />
                        </View>
                        <View style={styles.buttonSpacing}>
                            <Button
                                title={"Remove"}
                                onPress={(e) => onRemoveHandler(e)}
                                color={destructive}
                            />
                        </View>
                    </View>
                    :
                    null
                }
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    focusedTextInput: {
        flex: 0.4,
    },
    focusedButtonContainer: {
        flex: 0.5,
    },
    textInput: {
        flex: 0.7,
    },
    buttonContainer: {
        flex: 0.2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
    buttonSpacing: {
        flex: 0.4,
    }
});

export default ShoppingItem;