import React, { Component } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import ImageItem from '../imageItem'
import MusicItem from '../musicItem'

class UserGallery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }

  fetchUserGallery = () => {
    Axios.post(
      '/api/post/byuser',
      {},
      {
        headers: {
          'auth-token': this.props.currentUser.jwt
        }
      }
    )
      .then((result, error) => {
        console.log('error ', error)
        console.log('result ', result)

        if (result.status == 200 && result.data.files) {
          this.setState(prevState => ({
            files: result.data.files
          }))
        } else {
          this.setState({ error: result.data.message })
        }
      })
      .catch(error => {
        this.setState({ error: error })
        console.log('errors ', error)
      })
  }

  componentDidMount () {
    this.setState({ files: [] }, newState => {
      this.fetchUserGallery()
    })
  }

  update () {
    this.fetchUserGallery()
  }

  updateGallery = id => {
    console.log('update gallery', id)
    this.setState({ files: this.state.files.filter(file => file._id !== id) })
  }

  render () {
    return (
      <div>
        <div className='gallery-list row '>
          {this.state.files.length > 0 &&
            this.state.files.map((item, index) => {
              switch (item.types) {
                case 'image':
                  return (
                    <ImageItem
                      key={index}
                      item={item}
                      isActive={false}
                      delete={true}
                      name={true}
                      col='col-md-3 col-6'
                      updateGallery={id => this.updateGallery(id)}
                    />
                  )
                case 'music':
                  return (
                    <MusicItem
                      key={index}
                      item={item}
                      isActive={false}
                      delete={true}
                      name={true}
                      col='col-md-3 col-6'
                      updateGallery={id => this.updateGallery(id)}
                    />
                  )

                default:
                  return null
              }
            })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  UserGallery
)
