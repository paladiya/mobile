import React, { Component } from 'react'
import './itemoverview.style.scss'
import HeaderComponent from '../../components/header/header.component'
import UserImage from '../../assets/img/user.png'
import Page404 from '../page404'
import { createStructuredSelector } from 'reselect'
import { selectCurretnUser } from '../../redux/user/user-selector'
import Axios from 'axios'
import { doSearch } from '../../redux/search/search-action'
import { setCategory } from '../../redux/category/cat-action'
import { connect } from 'react-redux'
// import Promise from 'react-promise'
import MusicItem from '../musicItem'
import SharePopup from '../sharePopUp'
import { withRouter } from 'react-router'
import Loading from '../loading'

import ImageOverView from '../imageoverview'
class ItemOverViewComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fileName: '',
      pageFound: true,
      post: '',
      sharePopup: false
    }
    this.myRef = React.createRef()
  }

  componentDidMount () {
    console.log(this.props.location)
    window.scrollTo(0, 1000)
    this.fetchPost()
  }

  fetchPost = async () => {
    const result = await Axios.post('/api/post/getpost', {
      itemId: this.props.match.params.itemId
    })
    console.log('file ', result)

    if (result) {
      if (result.data.status == 200) {
        this.setState({ post: result.data.post })
      } else {
        this.setState({ pageFound: false })
      }
    }
  }

  plusDownload = async event => {
    const result = await Axios.post('/api/post/plusDownload', {
      postId: this.state.post._id
    })
    if (result) {
      if (result.data.status == 200) {
      }
    }
    // $(this).trigger(event)
  }

  downloadImage = () => {}

  searchTag (tag) {
    this.props.history.push(`/find/${tag}`)
  }

  toggleShare = () => {
    this.setState({ sharePopup: !this.state.sharePopup })
  }

  hide = () => {
    this.setState({ sharePopup: false })
  }

  render () {
    return this.state.pageFound ? (
      this.state.post ? (
        <div className='parent '>
          <div>
            <HeaderComponent />

            <div className='header-parent pt-2 d-flex flex-column align-items-md-start flex-md-row '>
              <div className='left col-12 col-md-10'>
                <div className='d-flex'>
                  <img src={UserImage} className='img-profile' />
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center'>
                      <h5 className='file-text'>
                        {this.state.post.fileOriginName}
                      </h5>
                      <i className='fa fa-download fa-2x ml-4 mr-2 text-primary' />
                      <h5 className='file-text text-primary '>
                        {this.state.post.downloads}
                      </h5>
                    </div>
                    <span className='user-text text-muted'>
                      by {this.state.post.userName}
                    </span>
                  </div>
                </div>
                <div className='tag-row'>
                  {this.state.post.fileTags.map((tag, index) => {
                    return (
                      <span
                        onClick={() => this.searchTag(tag)}
                        key={index}
                        className='badge badge-pill badge-info tagBadge'
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className='col-12 mt-4 col-md-2 d-flex justify-content-md-end  justify-content-center'>
                <button
                  type='button'
                  className='btn btn-primary btn-md mr-2'
                  onClick={this.toggleShare}
                >
                  <i className='fa fa-share fa-1.5x ' />
                </button>

                <a
                  href={
                    process.env.PUBLIC_URL +
                    '/api/' +
                    this.state.post.types +
                    '/' +
                    this.state.post.fileName
                  }
                  download={`${this.state.post.fileOriginName}`}
                  style={{ textDecoration: 'none' }}
                  className=' btn btn-primary btn-md'
                  onClick={() => {
                    setTimeout(() => {
                      this.plusDownload()
                    }, 3000)
                  }}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center mt-5'>
            {this.state.post.types == 'image' ? (
              <ImageOverView item={this.state.post} />
            ) : (
              <MusicItem
                item={this.state.post}
                isActive={false}
                col='col-md-4 col-12'
              />
            )}
          </div>
          {this.state.sharePopup && (
            <SharePopup
              shareLink={`${window.location.href}`}
              hide={this.hide}
              img={
                this.state.post.types == 'image'
                  ? window.location.href +
                    `/api/${this.state.post.types}/` +
                    this.state.post.fileName
                  : window.location.href + 'original.png'
              }
            />
          )}
        </div>
      ) : (
        <Loading />
      )
    ) : (
      <Page404 />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurretnUser
})

const mapDispatchToProps = dispatch => ({
  doSearch: term => dispatch(doSearch(term)),
  setCategory: cat => dispatch(setCategory(cat))
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ItemOverViewComponent)
)
