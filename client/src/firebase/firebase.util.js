import * as firebase from 'firebase'
import Axios from 'axios'

const firebaseConfig = {
  apiKey: 'AIzaSyCKOxzMuOVtAHzM5etPqvj-KMhsUZhLtek',
  authDomain: 'react-8e635.firebaseapp.com',
  databaseURL: 'https://react-8e635.firebaseio.com',
  projectId: 'react-8e635',
  storageBucket: 'react-8e635.appspot.com',
  messagingSenderId: '124894798621',
  appId: '1:124894798621:web:2cb8b1e003c08d3716b7f4',
  measurementId: 'G-9J42JQ04RM'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const fireStore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const createUserProfileDocument = async (userAuth, additionData) => {
  if (!userAuth) return

  const userRef = fireStore.doc(`users/${userAuth.uid}`)
  const snapShot = await userRef.get()

  if (!snapShot.exists) {
    const { displayName, email } = userAuth
    const createdAt = new Date()

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionData
      })
    } catch (error) {
      console.log(`set error ${error.message}`)
    }
  }

  console.log(userRef)

  return userRef
}

export const SignWithGoogle = () => auth.signInWithPopup(provider)

export const SigninWithEmail = (email, password) => {
  return Axios({
    method: 'post',
    url: '/api/user/login',
    headers: { 'content-type': 'application/json' },
    data: { email, password }
  })
}

export const SignupWithEmail = (name, email, password) => {
  return Axios({
    method: 'post',
    url: '/api/user/register',
    headers: { 'content-type': 'application/json' },
    data: { name, email, password }
  })
}

export const SignInWithGoogle = (name, email, gwt) => {
  return Axios({
    method: 'post',
    url: '/api/user/googleRegister',
    headers: { 'content-type': 'application/json' },
    data: { name, email, gwt }
  })
}
