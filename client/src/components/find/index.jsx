import React, { Component } from 'react'
import HeaderComponent from '../header/header.component'
import { setCategory } from '../../redux/category/cat-action'
import ImageItem from '../imageItem'
import MusicItem from '../musicItem'
import { connect } from 'react-redux'
import Axios from 'axios'
import Loading from '../loading'
import Page404 from '../page404'

class FindComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: this.props.match.params.searchTerm,
      items: [],
      error: '',
      loading: false,
      pageNum: 1
    }
  }

  fetchData = async () => {
    this.setState({ loading: true, items: [], error: '' }, newState => {
      Axios.post(`/api/post/find`, {
        pageNum: this.state.pageNum,
        searchTerm: this.state.searchTerm
      })
        .then((result, error) => {
          this.setState({ loading: false })
          console.log('error ', error)
          console.log('result ', result)

          if (result.status == 200 && result.data.files) {
            this.setState(prevState => ({
              items: [...prevState.items, ...result.data.files]
            }))
          } else {
            this.setState({ error: result.data.message })
          }
        })
        .catch(error => {
          this.setState({ loading: false })
          console.log('errors ', error)
        })
    })
  }

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate () {
    console.log('component did update ', this.props.match.params.searchTerm)
    if (this.state.searchTerm !== this.props.match.params.searchTerm) {
      console.log('set state ', this.props.match.params.searchTerm)
      this.setState(
        { searchTerm: this.props.match.params.searchTerm },
        newState => {
          console.log('state', this.state.searchTerm)

          this.fetchData()
        }
      )
    }
  }

  render () {
    if (this.state.items.length > 0) {
      return (
        <div>
          <HeaderComponent />
          <h5 className='mt-3 font-weight-bold text-muted'>
            {this.state.searchTerm} Ringtones and Wallpaper
          </h5>
          <div className='directory-list'>
            {this.state.items.map(item => {
              switch (item.types) {
                case 'image':
                  return (
                    <ImageItem
                      key={item._id}
                      item={item}
                      isActive={true}
                      name={true}
                      col='col-md-3 col-6'
                    />
                  )
                case 'music':
                  console.log(item)
                  return (
                    <MusicItem
                      key={item._id}
                      item={item}
                      isActive={true}
                      name={true}
                      col='col-md-3 col-6'
                    />
                  )
                default:
                  return null
              }
            })}
          </div>
        </div>
      )
    } else if (this.state.loading) {
      return (
        <div>
          <HeaderComponent />
          <Loading />
        </div>
      )
    } else {
      return (
        <div>
          <HeaderComponent />
          <Page404
            title='Items not found'
            description='The item you are looking for might have been removed or had its name changed or is temporarily unavailable.'
          />{' '}
        </div>
      )
    }
  }

  componentWillUnmount () {
    this.props.setCategory('all')
  }
}

const mapDispatchToProps = dispatch => ({
  setCategory: cat => dispatch(setCategory(cat))
})

export default connect(null, mapDispatchToProps)(FindComponent)
