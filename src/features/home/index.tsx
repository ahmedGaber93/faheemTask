import React from "react";
import {StyleSheet, Text, SafeAreaView, StatusBar, View} from 'react-native';
import UserComponent from './components/UserComponent';
import {any} from 'prop-types';



const users = [
    {
        name: "User1",
        uuid: "user1uuid",
        avatar: require("../../../assets/avatars/user1.png")
    },
    {
        name: "User2",
        uuid: "user2uuid",
        avatar: require("../../../assets/avatars/user2.png")
    },
];


type Props = {
    navigation: any,
}



const HomeScreen : React.FC<Props> = (
    {
        navigation
    }
) => {


    const onUserItemPress = (user: any, user2: any) => {
        navigation.navigate("chatScreen", {
            user,
            user2
        })
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"}/>


            <UserComponent
                onPress={() => onUserItemPress(users[0], users[1])}
                user={users[0]}/>

            <View style={{height: 80}}/>

            <UserComponent
                onPress={() => onUserItemPress(users[1], users[0])}
                user={users[1]}/>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#fff',
    },
});







export default HomeScreen;
