import React,{useEffect} from 'react'
import { StyleSheet, Text, View, AsyncStorage,ActivityIndicator } from 'react-native'
import Colors from '../constants/Colors'
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth'
const StartupScreen = (props) => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const tryLogin = async () =>{
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const {token, userId, expiryDate} = transformedData;
            const expirationalDate = new Date(expiryDate);

            if(expirationalDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth');
                return;
            }

            props.navigation.navigate('Shop');
            dispatch(authActions.authanticate(userId,token));

        };
        tryLogin();
    },[dispatch]);
    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    )
}

export default StartupScreen

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
