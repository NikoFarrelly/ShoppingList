import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {NativeRouter, Route} from 'react-router-native';
import ViewNotes from "./screens/ViewNotes/ViewNotes";
import ViewNote from "./screens/ViewNote/ViewNote";
import {PersistGate} from 'redux-persist/integration/react'
import {Provider} from "react-redux";
import {persistor, store} from './configureStore';
import {primaryColour} from "./screens/globalStyles";

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NativeRouter>
                    <SafeAreaView>
                        <View style={styles.appStyles}>

                            <Route exact path={"/"} component={ViewNotes}/>
                            <Route path={"/view"} component={ViewNote}/>

                        </View>
                    </SafeAreaView>
                </NativeRouter>
            </PersistGate>
        </Provider>
    );
};

const styles = StyleSheet.create({
    appStyles: {
        height: '100%',
        justifyContent: 'center',
        backgroundColor: primaryColour,
    }
});

export default App;
