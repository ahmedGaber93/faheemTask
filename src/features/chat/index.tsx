import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image, FlatList
} from "react-native";
import { usePubNub } from "pubnub-react";
import MessageItem from "./components/MessageItem";
import {MessageActionEvent} from "pubnub";


const channel = "privateChatChannel";

type Props = {
    route?: any,
}



const ChatScreen : React.FC<Props> = ({ route }) => {


    const user = route.params.user;
    const user2 = route.params.user2;


    const pubnub = usePubNub();

    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<any>([]);





    const getHistory = async () => {
        pubnub.fetchMessages(
            {
                includeMessageActions: true,
                channels: [channel],
                count: 100
            },
            async (status, response) => {

                const data = response.channels[channel].map(item => ({
                    id: item.message.id,
                    author: item.uuid,
                    content: item.message.content,
                    timetoken: item.timetoken,
                    actions: item.actions || {},
                }))
                setMessages(data);
            }
        );
    };











    useEffect(() => {
        if (pubnub) {
            pubnub.setUUID(user.uuid);

            const listener = {
                message: (envelope: any) => {
                    const msg = {
                        id: envelope.message.id,
                        author: envelope.publisher,
                        content: envelope.message.content,
                        timetoken: envelope.timetoken,
                        actions: {},
                    }
                    setMessages((msgs: any[]) => [...msgs, msg]);
                },
                messageAction : (ma: MessageActionEvent) => {
                    setMessages((messages: any) => messages.map((item: any) => {
                        if (ma.data.messageTimetoken === item.timetoken) {
                            return {
                                ...item,
                                actions: {
                                    ...(item?.actions || {}),
                                    [ma.data.type]: {[ma.data.value]: [{uuid: ma.data.uuid, actionTimetoken: ma.data.actionTimetoken}]}
                                }
                            }
                        }
                        return item;
                    }))
                }

            };

            pubnub.addListener(listener);
            pubnub.subscribe({ channels: [channel] });

            (async () => {
                await getHistory();
            })()

            return () => {
                pubnub.removeListener(listener);
                pubnub.unsubscribeAll();
            };
        }
    }, [pubnub]);




    const handleSubmit = async () => {

        // Create the message with random `id`.
        const message = {
            content: input,
            id: Math.random()
                .toString(16)
                .substring(2),
            pn_gcm:{
                notification:{
                    title:user.name,
                    body: input,
                }
            },
        };


        setInput("");

        await pubnub.publish({ channel, message });
    };


    const renderItem = ({item}: any) => {
        return(
            <MessageItem
                content={item.content}
                author={item.author}
                isMe={item.author === user.uuid}
                timetoken={item.timetoken}
                actions={item.actions}
                id={item.id} />
        )
    };





    return (
        <SafeAreaView style={styles.outerContainer}>
            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >


                <View style={styles.header}>

                    <View style={{
                        height : 50,
                        width : 50,
                        borderRadius : 50,
                        borderWidth : 1,
                        borderColor : "#ddd",
                        overflow : 'hidden',
                    }}>
                        <Image
                            resizeMode={"contain"}
                            style={{height : 50, width : 50}}
                            source={user.avatar} />
                    </View>

                        <Text style={styles.userName}>{user.name}</Text>

                </View>



                    <FlatList
                        inverted={true}
                        onEndReachedThreshold={.5}
                        contentContainerStyle={{flexGrow: 1}}
                        data={[...messages].reverse()}
                        renderItem={renderItem}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={item => item.timetoken.toString()}/>


                <View style={styles.bottomContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSubmit}
                        blurOnSubmit={false}
                        returnKeyType="send"
                        enablesReturnKeyAutomatically={true}
                        placeholder="Type a message."
                    />
                    <View style={styles.submitButton}>
                        <Button
                            disabled={input === ""}
                            title="Send"
                            onPress={handleSubmit} />
                    </View>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        height: "100%",
        backgroundColor : '#fff',
    },
    innerContainer: {
        width: "100%",
        height: "100%"
    },
    bottomContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderTopWidth : 1,
        borderTopColor : "#ddd",

    },
    textInput: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        elevation: 2,
        borderWidth : 1,
        borderColor : "#eee",
        borderRadius : 5,
    },
    submitButton: {
        position: "absolute",
        right: 32
    },
    header : {
        flexDirection : 'row',
        alignItems : 'center',
        padding : 12,
        borderBottomWidth : 1,
        borderBottomColor : "#ddd",

    },
    userName : {
        fontSize : 18,
        paddingHorizontal : 12,
    },


});


export default ChatScreen;
