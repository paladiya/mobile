import React, { Component } from 'react'
import './style.scss'
import axios from 'axios'
import ImageItem from '../imageItem'
import Page404 from '../page404'
import TrianglifyGenerate from '../Util/Trianglify'
import { PacmanLoader, RingLoader } from 'react-spinners'
class Wallpaper extends Component {
  constructor (props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this.showMoreRef = React.createRef()

    this.state = {
      items: [],
      error: '',
      loading: false,
      wallpapers: 1
    }
  }

  fetchData = async () => {
    console.log('pagenum', this.state.wallpapers)
    await this.setState({ loading: true })
    axios
      .post(`/api/post/wallpaper`, {
        pageNum: this.state.wallpapers
      })
      .then((result, error) => {
        console.log('error ', error)
        console.log('result ', result)

        if (result.status === 200 && result.data.files) {
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
          this.setState(prevState => ({
            items: [...prevState.items, ...newData],
            loading: false
          }))
        } else {
          this.setState({ error: result.data.message, loading: false })
        }
      })
      .catch(error => {
        console.log('errorsD', error.response)
        this.setState({ error: error, loading: false })
      })
  }

  componentDidMount () {
    this.fetchData()
  }

  loadMore = async () => {
    console.log('call loadmore')
    await this.setState(
      preState => ({ wallpapers: preState.wallpapers + 1, loading: true }),
      newState => {
        this.fetchData()
      }
    )
  }

  render () {
    console.log('com wall')

    return this.state.loading ? (
      <div className='parent-dir'>
        <RingLoader size={200} color='#4A90E2' />
      </div>
    ) : this.error && this.state.items.length > 1 ? (
      <Page404 />
    ) : (
      <div className='parent-dir'>
        <div className='directory-list'>
          {this.state.items.map((item, index) => {
            return (
              <ImageItem
                key={index}
                item={item}
                isActive={true}
                name={true}
                col='col-md-3 col-6'
              />
            )
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
            data-loading-text="<i className='fa fa-circle-o-notch fa-spin'></i> Loading"
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

export default Wallpaper
