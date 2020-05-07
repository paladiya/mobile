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

const FindComponent = lazy(() => import('./components/find/index'))
const MultipleUploadPage = lazy(() =>
  import('./pages/multipleUploadPage/multipleUploadPage')
)
const signupComponent = lazy(() =>
  import('./components/signup/signup.component')
)
const signinComponent = lazy(() =>
  import('./components/signin/signin.component')
)

const Page404 = lazy(() => import('./components/page404'))

const ItemOverViewComponent = lazy(() =>
  import('./components/itemoverview/itemoverview.component')
)

// const UploadPage = lazy(() => import('./pages/uploadpage/upload.page'))

const HomepageComponent = lazy(() =>
  import('./pages/homepage/homepage.component')
)

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
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path='/' component={HomepageComponent} />
            <Route exact path='/cat/:catId' component={HomepageComponent} />
            <Route path='/fileupload' component={UploadPage} />
            <Route path='/find/:searchTerm' component={FindComponent} />
            <Route path='/signin' component={signinComponent} />
            <Route path='/signup' component={signupComponent} />
            <Route path='/:cat/:itemId' component={ItemOverViewComponent} />
            <Route path='/test' component={Test} />
            <Route exact strict path='/rahul' component={MultipleUploadPage} />
            <Route component={Page404} />
          </Switch>
        </Suspense>
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
