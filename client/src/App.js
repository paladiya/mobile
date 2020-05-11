import React, { Suspense, lazy } from 'react'

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'

import { withRouter, Switch, Route } from 'react-router-dom'
import { selectCurretnUser } from './redux/user/user-selector'
import { setCurrentUser } from './redux/user/user-action'
import { createStructuredSelector } from 'reselect'

import Loading from './components/loading'
import { connect } from 'react-redux'
import { selectCat } from './redux/category/cat-selector'
import Test from './components/player'

import UploadPage from './pages/uploadpage/upload.page'
import FindComponent from './components/find/index'
import MultipleUploadPage from './pages/multipleUploadPage/multipleUploadPage'
import signupComponent from './components/signup/signup.component'
import signinComponent from './components/signin/signin.component'
import Page404 from './components/page404'
import ItemOverViewComponent from './components/itemoverview/itemoverview.component'
import HomepageComponent from './pages/homepage/homepage.component'
import RingtonesWallpaper from './components/directory/RingtonesWallpaper'
import Ringtones from './components/directory/Ringtones'
import Wallpaper from './components/directory/Wallpaper'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    window.addEventListener('load', function () {
      // Set a timeout...
      setTimeout(function () {
        // Hide the address bar!
        window.scrollTo(0, 1)
      }, 0)
    })
  }

  render () {
    return (
      <div className='App'>
        <Switch>
          <Route path='/fileupload' component={UploadPage} />
          <Route path='/find/:searchTerm' component={FindComponent} />
          <Route path='/signin' component={signinComponent} />
          <Route path='/signup' component={signupComponent} />
          <Route path='/:cat/:itemId' component={ItemOverViewComponent} />
          <Route path='/test' component={Test} />
          <Route exact strict path='/rahul' component={MultipleUploadPage} />
          <HomepageComponent>
            <Route
              component={({ match }) => (
                <Switch>
                  <Route
                    exact
                    path='/ringtones-and-wallpapers'
                    component={RingtonesWallpaper}
                  />
                  <Route exact path='/ringtones' component={Ringtones} />
                  <Route exact path='/wallpapers' component={Wallpaper} />
                  <Route strict exact path='/' component={RingtonesWallpaper} />
                  <Route component={Page404} />
                </Switch>
              )}
            />
          </HomepageComponent>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurretnUser,
  cat: selectCat
})

const mapDispatchToProps = dispatch => ({
  setCurrentUsers: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
