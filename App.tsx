import React from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import HomeScreen from "./src/features/home";
import ChatScreen from "./src/features/chat";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import {I18nManager} from "react-native";



const pubnub = new PubNub({
    subscribeKey: "sub-c-64e8f0ca-829e-11e8-8d65-6a72d609577c",
    publishKey: "pub-c-9c333c32-027a-4027-842e-f9fb7405c10f",
});


const Stack = createNativeStackNavigator();



const channel = "privateChatChannel";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);


export default function App() {






    React.useEffect(() => {

        (async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }

            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                pubnub.push.addChannels(
                    {
                        channels: [channel],
                        device: fcmToken,
                        pushGateway: "gcm",
                    },
                    function(status) {
                        //console.log(status);
                    }
                );
            } else {
                console.log("Failed", "No token received");
            }
        })();


    }, []);






    return (
        <PubNubProvider client={pubnub}>
            <NavigationContainer>

                <Stack.Navigator >

                    <Stack.Screen
                        options={{headerShown:false}}
                        name="home"
                        component={HomeScreen} />

                    <Stack.Screen
                        options={{headerShown:false}}
                        name="chatScreen"
                        component={ChatScreen} />

                </Stack.Navigator>

            </NavigationContainer>
        </PubNubProvider>
    );
}
