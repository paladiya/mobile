import React, { Component } from 'react'
import './style.scss'
import axios from 'axios'
import ImageItem from '../imageItem'
import MusicItem from '../musicItem'
import Page404 from '../page404'
import TrianglifyGenerate from '../Util/Trianglify'
import { RingLoader } from 'react-spinners'
import InfiniteScroll from 'react-infinite-scroll-component'

class RingtonesWallpaper extends Component {
  constructor (props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
    this.showMoreRef = React.createRef()

    this.state = {
      items: [],
      error: '',
      loading: false,
      all: 1,
      isLast: true
    }
  }

  fetchData = async () => {
    const id =
      this.state.items.length > 0
        ? this.state.items[this.state.items.length - 1]._id
        : 0
    console.log('pagenum', this.state.all)
    console.log('page_id', id)
    await this.setState({ loading: true })
    axios
      .post(`/api/post/all`, {
        pageNum: this.state.all,
        _id: id
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
            loading: false,
            isLast: result.data.isLast
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
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.loadMore}
          hasMore={!this.state.isLast}
          loader={
            <div>
              <span
                className='spinner-border spinner-border-sm'
                role='status'
                aria-hidden='true'
              ></span>{' '}
              Loading...
            </div>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
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
                      col='col-md-2 col-4'
                    />
                  )
                case 'music':
                  return (
                    <MusicItem
                      key={index}
                      item={item}
                      isActive={true}
                      name={true}
                      col='col-md-2 col-4'
                    />
                  )

                default:
                  return null
              }
            })}
          </div>
        </InfiniteScroll>
        {this.state.items.length >= 24 && (
          <button
            id='showmore'
            type='button'
            ref={this.showMoreRef}
            className='btn btn-primary w-50 btn-loading d-none'
            variant='contained'
            color='primary'
            onClick={this.loadMore}
          >
            {!this.state.loading ? (
              ' Show More'
            ) : (
              <div>
                <span
                  className='spinner-border spinner-border-sm'
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
