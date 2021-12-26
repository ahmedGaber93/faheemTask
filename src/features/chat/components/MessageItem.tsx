import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {usePubNub} from "pubnub-react";


type Props = {
    id?: string,
    author?: string,
    content?: string,
    timetoken?: any,
    actions?: any,
    isMe?: boolean,
}


const channel = "privateChatChannel";


const MessageItem: React.FC<Props> = (
    {
        id,
        author,
        content,
        timetoken,
        isMe = false,
        actions = {},
    }
) => {



    const pubnub = usePubNub();



    const getDate = () => {

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;


        let diff = Date.now() - Math.floor(timetoken/10000);

        if ((diff / second) < 60){
            return "just now";
        } else if ((diff / minute) < 60){
            return Math.floor(diff / minute) + " m";
        } else if ((diff / hour < 24)){
            return Math.floor(diff / hour) + " h";
        } else {
            return Math.floor(diff / day) + " d";
        }

    };







    const readMessage = async () => {
        await pubnub.addMessageAction(
            {
                channel,
                messageTimetoken: timetoken,
                action: {
                    type: 'receipt',
                    value: 'read',
                },
            },
            function(status, response) {

            }
        );
    };






    React.useEffect(() => {

        if (pubnub && !isMe) {
            if (!isRead()){
                readMessage();
            }
        }

    }, [pubnub]);





    const isRead = () => {
        return actions?.receipt?.read !== undefined;
    };





    return (
        <View style={[
            styles.messageContainer,
            {
                flexDirection: isMe? "row" : "row-reverse",
            }
        ]}>
            <View style={styles.messageContent}>
                <View style={styles.upMessage}>
                    <Text>{content}</Text>
                </View>
                <Text style={{alignSelf:"flex-end"}}>{getDate()}</Text>
            </View>

            <View style={{width: 16}}/>

            {isMe &&
            <MaterialCommunityIcons
                name={"check-all"}
                color={isRead() ? "#a2bcdf" : "#b1b38c"}
                size={22} />}


        </View>
    );

};


const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        marginTop: 16,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 4
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 16
    },
    avatarContent: {
        fontSize: 30,
        textAlign: "center",
        textAlignVertical: "center"
    },
    messageContent: {
        minWidth: 60,
        maxWidth: "80%"
    },
    upMessage : {
        borderWidth : 1,
        borderColor : "#e6e6e6",
        backgroundColor : '#fefefe',
        paddingHorizontal : 12,
        paddingVertical : 8,
    },



});

export default MessageItem;
