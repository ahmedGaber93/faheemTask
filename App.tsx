import React, {useState} from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import HomeScreen from "./src/features/home";
import ChatScreen from "./src/features/chat";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import codePush from "react-native-code-push"
import UpdateProgressScreen from "./src/components/update-progress/UpdateProgressScreen";



const pubnub = new PubNub({
    subscribeKey: "sub-c-64e8f0ca-829e-11e8-8d65-6a72d609577c",
    publishKey: "pub-c-9c333c32-027a-4027-842e-f9fb7405c10f",
});


const Stack = createNativeStackNavigator();



const channel = "privateChatChannel";



export default function App() {




    const [ready, setReady] = useState(false);
    const [showUpdateScreen, setUpdateScreenVisibility] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0);



    const handleUpdateOverAirProgress = ({ totalBytes, receivedBytes}: any) => {
        const currentProgress = Math.round((receivedBytes/totalBytes) * 100);
        if (currentProgress > updateProgress + 5)
            setUpdateProgress(currentProgress);
    };



    React.useEffect(() => {



        const fetchData = async () => {
            setReady(true);
        };


        codePush.checkForUpdate()
            .then(async (update) => {
                if (!update) {
                    await fetchData();
                } else {
                    if (update?.isMandatory){
                        setUpdateScreenVisibility(true);
                        const newBundle = await update.download(handleUpdateOverAirProgress);
                        await newBundle.install(codePush.InstallMode.IMMEDIATE)
                    }else{
                        await codePush.sync();
                        fetchData();
                    }
                }
            })
            .catch(error => {
                fetchData();
            });

    }, []);


    React.useEffect(() => {
        if(ready){

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

        }
    }, [ready]);




    if (!ready) {
        return null;
    }



    if (showUpdateScreen) {
        return <UpdateProgressScreen
            logoSource={require("./assets/logos/logo.png")}
            progress={updateProgress}/>
    }



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
