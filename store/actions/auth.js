import {AsyncStorage} from 'react-native'

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authanticate =(userId, token)=>{
    return{
        type: AUTHENTICATE,
        userId: userId,
        token: token
    }
};

export const signup = (email, password) =>{
    return async dispatch=>{
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= AIzaSyAZl63Iz5ppnAqLaqJTSHzdcP70c40koi4',
        {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password : password,
                returnSecureToken : true
            })
        });
        
        if(!response.ok){
            const errorResData = await response.json();            
            const errorId = errorResData.error.message;
            console.log(errorId);
            let message = 'Something went wrong';
            if(errorId === 'EMAIL_EXISTS'){
                message = 'This email exists already';
            } 
            throw new Error(message);

        }


        const resData = await response.json();
        console.log(resData);
        dispatch(authanticate(resData.localId, resData.idToken));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        savaDataToStorage(resData.idToken,resData.localId, expirationDate);
    
    }
};


export const login = (email, password) =>{
    return async dispatch=>{
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key= AIzaSyAZl63Iz5ppnAqLaqJTSHzdcP70c40koi4',
        {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password : password,
                returnSecureToken : true
            })
        });
        if(!response.ok){
            const errorResData = await response.json();            
            const errorId = errorResData.error.message;
            console.log(errorId);
            let message = 'Something went wrong';
            if(errorId === 'EMAIL_NOT_FOUND'){
                message = 'This email could not be found';
            } else if(errorId === 'INVALID_PASSWORD'){
                message='This password is not valid'
            }
            throw new Error(message);

        }
        const resData = await response.json();
        console.log(resData);
        dispatch(authanticate(resData.localId, resData.idToken));

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        savaDataToStorage(resData.idToken,resData.localId, expirationDate);
    }
};

export const logout=()=>{
    return{
        type:LOGOUT,
        
    }
} 

const savaDataToStorage = (token, userId, expirationDate) =>{
    AsyncStorage.setItem(
        'userId',
        JSON.stringify({
        token : token,
        userId : userId,
        expiryDate: expirationDate.toISOString()
    }));
};