import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { selectCurretnUser } from './redux/user/user-selector'
import { setCurrentUser } from './redux/user/user-action'
import { createStructuredSelector } from 'reselect'
import HomepageComponent from './pages/homepage/homepage.component'
import ItemOverViewComponent from './components/itemoverview/itemoverview.component'
import UploadPage from './pages/uploadpage/upload.page'
import { connect } from 'react-redux'
import { selectCat } from './redux/category/cat-selector'
import Page404 from './components/page404'
import FindComponent from './components/find/index'
import MultipleUploadPage from './pages/multipleUploadPage/multipleUploadPage'
import signupComponent from './components/signup/signup.component'
import signinComponent from './components/signin/signin.component'

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
    console.log(process.env.PUBLIC_URL)
    return (
      <div className='App container-md'>
        <Switch>
          <Route exact path='/' component={HomepageComponent} />
          <Route exact path='/cat/:catId' component={HomepageComponent} />
          <Route path='/fileupload' component={UploadPage} />
          <Route path='/find/:searchTerm' component={FindComponent} />
          <Route path='/signin' component={signinComponent} />
          <Route path='/signup' component={signupComponent} />
          <Route path='/:cat/:itemId' component={ItemOverViewComponent} />
          <Route exact strict path='/rahul' component={MultipleUploadPage} />
          <Route component={Page404} />
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
