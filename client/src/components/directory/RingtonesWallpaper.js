import React, { Component } from 'react'
import './style.scss'
import axios from 'axios'
import ImageItem from '../imageItem'
import MusicItem from '../musicItem'
import Page404 from '../page404'
import TrianglifyGenerate from '../Util/Trianglify'
import { PacmanLoader, RingLoader } from 'react-spinners'

class RingtonesWallpaper extends Component {
  constructor (props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this.showMoreRef = React.createRef()

    this.state = {
      items: [],
      error: '',
      loading: false,
      all: 1
    }
  }

  fetchData = async () => {
    console.log('pagenum', this.state.all)
    await this.setState({ loading: true })
    axios
      .post(`/api/post/all`, {
        pageNum: this.state.all
      })
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

  //   componentDidUpdate (prevProps, prevState, snapshot) {
  //     console.log('this.componentDidUpdate')
  //     if (this.props.cat != prevProps.cat) {
  //       this.setState({ items: [] }, newState => {
  //         this.fetchData()
  //       })
  //     }
  //   }

  loadMore = async () => {
    console.log('call loadmore')
    await this.setState(
      preState => ({ all: preState.all + 1, loading: true }),
      newState => {
        this.fetchData()
      }
    )
  }

  render () {
    console.log('ring-wall component')
    return this.error && this.state.items.length > 1 ? (
      <Page404 />
    ) : (
      <div className='parent-dir'>
        {this.state.loading && (
          <div className='parent-dir'>
            <RingLoader size={200} color='#4A90E2' />
          </div>
        )}
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

export default RingtonesWallpaper
