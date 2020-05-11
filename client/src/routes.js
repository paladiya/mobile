import React from 'react'
//Switch was introduced in react router v4
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function Routes () {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/fileupload' />
        <Route path='/find/:searchTerm' />
        <Route path='/signin' />
        <Route path='/signup' />
        <Route path='/:cat/:itemId' />
        <Route exact path='/ringtones-and-wallpapers' />
        <Route exact path='/ringtones' />
        <Route exact path='/wallpapers' />
      </Switch>
    </BrowserRouter>
  )
}
export default Routes
