import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectCurretnUser } from '../../redux/user/user-selector'
import Axios from 'axios'
import Img from 'react-image'
import { GridLoader } from 'react-spinners'
class ImageItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      image: ''
    }
  }

  deleteImage = async id => {
    const result = await Axios.post(
      '/api/post/delete',
      { id: id },
      {
        headers: {
          'auth-token': this.props.currentUser.jwt
        }
      }
    )
    console.log(result)
    if (result.status === 200) {
      return id
    }
    console.log(result)
  }

  componentDidMount () {}

  render () {
    return (
      <div className={`${this.props.col} list-item align-self-center`}>
        <Link
          to={{
            pathname: '/' + this.props.item.types + '/' + this.props.item._id,
            state: { item: this.props.item }
          }}
          onClick={e => !this.props.isActive && e.preventDefault()}
        >
          <div className='card border-red'>
            <Img
              crossorigin='anonymous'
              className='img-cover card-img'
              src={`/api/${this.props.item.types}/resize/${this.props.item.fileName}`}
              loader={<GridLoader size={20} margin={10} />}
              unloader={<GridLoader size={20} margin={10} />}
            />
            <div className='card-img-overlay border-0 '>
              {this.props.name && (
                <h5 className='card-title'>{this.props.item.fileOriginName}</h5>
              )}
              {this.props.delete && (
                <i
                  onClick={async () => {
                    let deleteId = await this.deleteImage(this.props.item._id)
                    this.props.updateGallery(deleteId)
                  }}
                  className='fa fa-times fa-2x btn-close'
                ></i>
              )}
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurretnUser
})

export default withRouter(connect(mapStateToProps, null)(ImageItem))
