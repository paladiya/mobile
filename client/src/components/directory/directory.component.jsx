import React, { Component } from 'react'
import './style.scss'
import axios from 'axios'
import { connect } from 'react-redux'
import { selectCurretnUser } from '../../redux/user/user-selector'
import { createStructuredSelector } from 'reselect'
import { selectCat } from '../../redux/category/cat-selector'
import { selectToken } from '../../redux/guest/guest-selector'
import ImageItem from '../imageItem'
import MusicItem from '../musicItem'
import { selectSearchTerm } from '../../redux/search/search-selector'
import Page404 from '../page404'
import { setToken } from '../../redux/guest/guest-action'
import TrianglifyGenerate from '../Util/Trianglify'
import $ from 'jquery'
class DirectoryComponent extends Component {
  constructor (props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this.showMoreRef = React.createRef()

    this.state = {
      items: [],
      error: '',
      loading: false,
      all: 1,
      music: 1,
      ringtones: 1
    }
  }

  fetchData = async () => {
    let pageNum = this.props.cat.toLowerCase()
    console.log('pagenum', this.state.all)
    const token = this.props.token
    console.log('token ', token)
    await this.setState({ loading: true })
    axios
      .post(
        `/api/post/${this.props.cat.toLowerCase()}`,
        {
          pageNum: this.state[pageNum]
        },
        {
          headers: {
            authorization: token
          }
        }
      )
      .then((result, error) => {
        console.log('error ', error)
        console.log('result ', result)

        if (result.status == 200 && result.data.files) {
          const data = result.data.files
          const newData = data.map(map => {
            if (map.types === 'music') {
              return {
                ...map,
                pattern: TrianglifyGenerate()
                  .canvas()
                  .toDataURL()
              }
            } else {
              return map
            }
          })
          console.log('newData', newData)
          this.setState(prevState => ({
            items: [...prevState.items, ...newData],
            loading: false
          }))
        } else if (result.status == 401) {
          console.log('401', result)
        }
        {
          this.setState({ error: result.data.message, loading: false })
        }
      })
      .catch(error => {
        console.log('errorsD', error.response)

        if (error.response) {
          if (error.response.status == 401) {
            this.props.setToken(error.response.data.token)
          }
        }
        this.setState({ error: error, loading: false })
      })
  }

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('this.componentDidUpdate')
    if (this.props.cat != prevProps.cat) {
      this.setState({ items: [] }, newState => {
        this.fetchData()
      })
    }
  }

  loadMore = async () => {
    console.log('call loadmore')
    await this.setState({ loading: true })
    switch (this.props.cat.toLowerCase()) {
      case 'all':
        this.setState(
          preState => ({ all: preState.all + 1 }),
          newState => {
            this.fetchData()
          }
        )
        console.log(this.props.cat.toLowerCase())
        break
      case 'wallpaper':
        this.setState(
          preState => ({
            wallpaper: preState.wallpaper + 1
          }),
          newState => {
            this.fetchData()
          }
        )
        break
      case 'ringtones':
        this.setState(
          preState => ({
            ringtones: preState.music + 1
          }),
          newState => {
            this.fetchData()
          }
        )
        break
      default:
        break
    }
  }

  render () {
    console.log('directory component')
    return this.error && this.state.items.length > 1 ? (
      <Page404 />
    ) : (
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div className='directory-list'>
          {this.state.items.map((item, index) => {
            switch (item.types) {
              case 'image':
                return (
                  <ImageItem
                    key={index}
                    item={item}
                    isActive={true}
                    name={true}
                    col='col-md-3 col-6'
                  />
                )
              case 'music':
                return (
                  <MusicItem
                    key={index}
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

        {this.state.items.length >= 24 && (
          <button
            id='showmore'
            type='button'
            ref={this.showMoreRef}
            className='btn btn-primary w-50 btn-loading'
            variant='contained'
            color='primary'
            onClick={this.loadMore}
          >
            {!this.state.loading ? (
              ' Show More'
            ) : (
              <div>
                <span
                  class='spinner-border spinner-border-sm'
                  role='status'
                  aria-hidden='true'
                ></span>{' '}
                Loading...
              </div>
            )}
          </button>
        )}
      </div>
    )
  }
}

const mapStateToProsp = createStructuredSelector({
  currentUser: selectCurretnUser,
  cat: selectCat,
  searchTerm: selectSearchTerm,
  token: selectToken
})

const mapDispatchToProp = dispatch => ({
  setToken: token => dispatch(setToken(token))
})

export default connect(mapStateToProsp, mapDispatchToProp)(DirectoryComponent)
