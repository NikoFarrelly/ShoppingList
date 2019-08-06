import React, { useEffect } from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

const NUM_EXAMPLES = 3;

const NoteCard = ({data, onCardPress}) => {

    const moreToShow = data.Items.length > NUM_EXAMPLES;

    // Show up to 3 items
    let exampleItems = data.Items;
    if (moreToShow) {
        exampleItems = data.Items.slice(0, NUM_EXAMPLES);
    }

    console.log('data:', data);

    return (
        <TouchableOpacity style={styles.container} onPress={onCardPress}>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>{data.Title}</Text>
            </View>

            <View style={styles.contentContainer}>
                {data.Items ?
                    (
                        exampleItems.map((item, index) => {
                            return <Text key={index}>{item}</Text>
                        })
                    )
                    : null}

                {moreToShow ?
                    (<Text>...</Text>)
                    : null
                }
            </View>

        </TouchableOpacity>
    );
};

const CARD_WIDTH = Math.round(Dimensions.get('window').width / 2 - 15);

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        margin: 5,
        width: CARD_WIDTH,
        backgroundColor: 'white',
    },
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 10,
        backgroundColor: '#e0ebeb',
    },
    title: {
        fontWeight: 'bold',
        paddingLeft: 5,
    },
    contentContainer: {
        padding: 5,
    }
});

export default NoteCard;
