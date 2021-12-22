import React from 'react';
import {View, StyleSheet, Image, Animated, Easing} from 'react-native';







const ProgressView = (
    {
        value = 0, // value from 0 to 100
        color = '#169aba'
    }
) => {



    const anim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {

        Animated.timing(anim, {
            toValue: value,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true
        }).start();

    }, [value]);






    const style : any = {
        position : 'absolute',
        transform: [
            {
                translateX: anim.interpolate({
                    inputRange: [0, 100],
                    outputRange: [-150, 0]
                })
            }
            ],
        height : 5,
        width : 150,
        opacity : .9,
        backgroundColor : color,
        borderRadius : 8,
    };





    return (
        <View style={{
            width : 150,
            height : 5,
            borderRadius : 5,
            overflow : 'hidden',
            backgroundColor : '#d9d9d9'}}>

            <Animated.View
                style={[
                    style
                ]}
            />


        </View>
    );







};







const UpdateProgressScreen = ({progress, progressColor, logoSource = null} : any) => {


    return (
        <View style={styles.container}>
            <Image source={logoSource} resizeMode={"contain"} style={styles.logo}/>
            <ProgressView color={progressColor} value={progress}/>
        </View>
    );


};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo : {
        height : 100,
        width : 150,
        marginBottom : 30,
    },

});

export default UpdateProgressScreen;
