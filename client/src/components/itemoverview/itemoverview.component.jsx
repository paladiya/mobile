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
import SharePopup from '../sharePopUp'
import { withRouter } from 'react-router'
import Loading from '../loading'
import MusicOverView from '../musicoverview'
import ImageOverView from '../imageoverview'
import TrianglifyGenerate from '../Util/Trianglify'
import { Helmet } from 'react-helmet'
import SvgDownload from '../../assets/svg/download.svg'
import SvgShare from '../../assets/svg/share.svg'
class ItemOverViewComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fileName: '',
      pageFound: true,
      post: '',
      sharePopup: false,
      isZoom: false
    }
    this.myRef = React.createRef()
  }

  componentDidMount () {
    console.log(this.props.location)
    this.fetchPost()
  }

  fetchPost = async () => {
    const result = await Axios.post('/api/post/getpost', {
      itemId: this.props.match.params.itemId
    })
    console.log('file ', result)

    if (result) {
      if (result.data.status == 200) {
        if (result.data.post.types === 'music') {
          this.setState({
            post: {
              ...result.data.post,
              pattern: TrianglifyGenerate()
                .canvas()
                .toDataURL()
            }
          })

          return
        }
        this.setState({
          post: result.data.post
        })
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
    const shareData = {
      title: 'Mobile60',
      text:
        'Download free Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69.',
      url: `${window.location.origin}/api/${this.state.post.types}/ ${this.state.post.fileName}`
    }
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          console.log('Thanks for sharing!')
        })
        .catch(console.error)
    } else {
      // shareDialog.classList.add('is-open');
    }
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

  scroll = () => {
    // setTimeout(() => {
    //   // scrollToComponent(this.Red, {
    //   //   offset: 0,
    //   //   align: 'middle',
    //   //   duration: 500,
    //   //   ease: 'inCirc'
    //   // })
    //   // this.myRef.current.scrollIntoView(false)
    //   window.scrollTo({
    //     left: 0,
    //     top: document.body.scrollHeight,
    //     behavior: 'smooth'
    //   })
    // }, 500)
  }
  toggleZoom = () => {
    this.setState({ isZoom: !this.state.isZoom })
  }

  render () {
    return this.state.pageFound ? (
      this.state.post ? (
        <div className='parent '>
          {this.state.post.types === 'image' ? (
            <Helmet>
              <title>{this.state.post.fileOriginName}</title>
              <meta
                name='description'
                content="'Download free Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69.in"
              />
              <meta
                property='image'
                content={`${window.location.href}/api/${this.state.post.types}/resize/${this.state.post.fileName}`}
              />
              <meta
                property='og:title'
                content={this.state.post.fileOriginName}
              />
              <meta
                property='og:description'
                content='Download free Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69. billion s of popular wallpaper and ringtones on mobile69 personalize your phone to suit you Browse our Content for free :)'
              />
              <meta
                property='og:image'
                content={`${window.location.href}/api/${this.state.post.types}/resize/${this.state.post.fileName}`}
              />
              <meta
                property='og:image:secure_url'
                content={`${window.location.href}/api/${this.state.post.types}/resize/${this.state.post.fileName}`}
              />

              <meta property='og:image:type' content='image/jpeg' />
              <meta property='og:image:width' content='400' />
              <meta property='og:image:height' content='300' />
              <meta property='og:image:alt' content='Mobile69.in' />
            </Helmet>
          ) : (
            <Helmet>
              <title>{this.state.post.fileOriginName}</title>

              <meta
                property='og:title'
                content={this.state.post.fileOriginName}
              />
              <meta
                property='og:description'
                content='Download free Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69. billion s of popular wallpaper and ringtones on mobile69 personalize your phone to suit you Browse our Content for free :)'
              />
              <meta
                property='og:audio'
                content={`${window.location.href}/api/${this.state.post.types}/resize/${this.state.post.fileName}`}
              />
            </Helmet>
          )}
          <div>
            <HeaderComponent />
            {!this.state.isZoom && (
              <div className='header-parent pt-2 d-flex flex-column align-items-md-start flex-md-row '>
                <div className='left col-12 col-md-10'>
                  <div className='d-flex'>
                    <img src={UserImage} className='img-profile' />
                    <div className='d-flex flex-column'>
                      <div className='d-flex align-items-center'>
                        <h5 className='file-text'>
                          {this.state.post.fileOriginName}
                        </h5>
                        <h5 className='file-text text-primary '>
                          <img
                            src={SvgDownload}
                            className='ml-4 mr-2 align-self-center text-primary'
                          />
                        </h5>

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
                  <img
                    src={SvgShare}
                    type='button'
                    className='btn btn-primary btn-md mr-2 text-white'
                    onClick={this.toggleShare}
                  />

                  <a
                    href={
                      '/api/' +
                      this.state.post.types +
                      '/' +
                      this.state.post.fileName
                    }
                    // onLoad={this.scroll()}
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
            )}
          </div>
          <div className='media'>
            {this.state.post.types == 'image' ? (
              <ImageOverView
                item={this.state.post}
                isZoom={this.state.isZoom}
                toggleZoom={this.toggleZoom}
              />
            ) : (
              <MusicOverView
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
