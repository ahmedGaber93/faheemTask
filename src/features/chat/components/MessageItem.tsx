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
    lastReadTime?: number,
    isMe?: boolean,
}
const channel = "privateChatChannel";


const MessageItem: React.FC<Props> = (
    {
        id,
        author,
        content,
        timetoken,
        lastReadTime = 0,
        isMe = false,
        actions = {},
    }
) => {
    const pubnub = usePubNub();


    const getDate = () => {
        let diff = Date.now() - Math.floor(timetoken/10000);

        if ((diff / 1000) < 60){
            return "just now";
        } else if ((diff / 60000 < 60)){
            return Math.floor(diff / 60000) + " m";
        } else if ((diff / 360000 < 24)){
            return Math.floor(diff / 360000) + " h";
        } else {
            return Math.floor(diff / (360000 * 24)) + " d";
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
                console.log("reeeestatus", status);
                console.log("reeee", response);
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
                color={isRead() ? "green" : "red"}
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
