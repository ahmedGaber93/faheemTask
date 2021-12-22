import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"


type Props = {
    user?: any,
    onPress?: () => void,
}


const UserComponent: React.FC<Props> = (
    {
        user,
        onPress = () => {},
    }
) => {

    return (
        <TouchableOpacity
            activeOpacity={.8}
            onPress={onPress}
            style={styles.container}>

            <Text style={styles.title}>{user?.name}</Text>

            <View style={{width: 20}}/>

            <MaterialCommunityIcons
                name={"chat-processing"}
                size={26} />

        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection : 'row',
        width : 200,
        height : 56,
        borderRadius : 5,
        borderWidth : 2,
        borderColor : "#777",
    },
    title : {
        fontSize : 18,
    },

});

export default UserComponent;
