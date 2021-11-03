import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import PrimaryButton, { SecondaryButtonBig, IconButton, TextButton } from './../components/button';
import { TextSecondary } from './../components/text';
import Form from './../components/form.js';
import Input, { TextArea } from './../components/input'
import ErrorMessage from './../components/error'
import Header from './../components/header';

import cameraIcon from './../assets/icons/camera.svg';
import cancelIcon from './../assets/icons/cancel.svg';

import { API_URL } from './../services/api';
import { setPhotoAlt, setPhotoInfo } from './../services/post';

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import successCheck from './../assets/icons/success-check.png'

import './../css/new-post.css';

class NewPost extends React.Component {
  constructor(props) {
    super(props)

    this.postPhotoFile = React.createRef()
    this.photoInfoForm = React.createRef()
    this.choseFile = this.choseFile.bind(this)
    // this.ctx = document.createElement('CANVAS').getContext('2d')
    this.resetUpload = this.resetUpload.bind(this)
    this.setPhotoInfo = this.setPhotoInfo.bind(this)
    this.sendFile = this.sendFile.bind(this)
    this.uploadPostPhoto = this.uploadPostPhoto.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.isValidImageFile = this.isValidImageFile.bind(this)
    this.isValidImageSize = this.isValidImageSize.bind(this)
    this.renderImage = this.renderImage.bind(this)
    this.forbiddenTagWords = [' le ',' la ',' des ',' les ',' de ',' une ',' dans ',' plusieurs ',' pour ', ' un ', ' du ', 
                              ' avec ', ' depuis ',' ou ',' où ',' qui ',', ',' est ',' à ',' a '," l'", ' sur ', ' son ',
                              ' ses ', ' sa ', ' leur ', ' lui ', 
                              ' the ',' form ',' in ',' by ',' many ',' much ',' of ',' for ',' that ', ' on ',
                              ' where ',' is ',' at ', ' with ', ' and ', ' it ']

    this.state = {
      publicId: '',
      alt: '',
      uploadProgress: 0,
      errorMessage: '',
      camera: '',
      place: '',
      shutterSpeed: '',
      aperture: '',
      focalLength: '',
      iso: '',
      tags: '',
      caption: '',
      isUserLoggedIn: false,
      isUploading: false,
      loading: false,
      postPhotoUrl: null,
      isFileValid: true,
      hasChosenFile: false,
      hasUploadedPhoto: false,
      type: null,
      hasUpdatedInfo: false,
      isImageLoading: false
    }
  }

  componentDidMount() {
    setTitle("New Post")
  }

  async renderImage() {
    const file = this.postPhotoFile.current.files[0]

    if (!file) return

    this.setState({isImageLoading: true})

    let url = window.URL.createObjectURL(file)

    if (!this.isValidImageFile(file.name)) {
      return this.setState({
        isFileValid: false,
        errorMessage: `${_("Votre image doit être du type (.jpg)")}`,
        isImageLoading: false
      })
    }

    try {
      const imageSize = await this.getImageSize(url)
      if (imageSize < 16000000) {
        return this.setState({
          isFileValid: false,
          errorMessage: `${_("La résolution de votre photo doit être d’au moins 16 Mega Pixel")}`,
          hasChosenFile: false 
        })
      }
      this.setState({
        postPhotoUrl: url, 
        file: file,
        hasChosenFile: true,
        isFileValid: true
      })
    }catch(err) {
      return this.setState({
        isFileValid: false,
        errorMessage: `${_("Veuillez fournir un fichier valide")}`
      })
    }

  }

  isValidImageFile(filename) {
    let validExtentions = ['jpg', 'png', 'jpeg']
    let fileExtention = filename.split('.')[filename.split('.').length - 1].toLowerCase()
    if (validExtentions.indexOf(fileExtention) === -1) return false
    return true
  }

  getImageSize(url) {
    return new Promise( (resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => {
        if ( img.naturalWidth <= img.naturalHeight) {
          this.setState({type: 'portrait'})
        }else {
          this.setState({type: 'landscape'})
        }

        resolve(img.naturalHeight * img.naturalWidth) 
        this.setState({isImageLoading: false})
      }
      img.onerror = () => reject(null)    
    })
  }

  isValidImageSize(file) {
    if (file.size < 16000000) return false
    return true
  }

  onInputChange(e) {
    let name = e.target.name
    let value = e.target.value

    if (name === 'aperture' && value.length === 1) {
      value = 'ƒ/' + value
    }

    this.setState({[name]: value,})
  }

  resetUpload() {
    this.setState({
      hasChosenFile: false, 
      postPhotoUrl: null,
      isImageLoading: false
    })
  }

  sendFile(formData) {    
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'json'

    xhr.addEventListener('load', e => {
      const publicId = xhr.response.publicId
      this.setState({publicId})
      setPhotoAlt({
        publicId,
        alt: this.state.alt
      })
    })

    xhr.upload.addEventListener('load', e => {
      this.setState({
        uploadProgress: 100,
        hasUploadedPhoto: true
      })
    })

    xhr.upload.addEventListener('progress', e => {
      this.setState({uploadProgress: (e.loaded / e.total) * 90})
    })

    xhr.upload.addEventListener('error', e => {
      this.setState({
        isFileValid: false,
        hasChosenFile: false,
        postPhotoUrl: null,
        uploadProgress: 0,
        isUploading: false,
        errorMessage: `${_("Une erreur est survenue l'ors du téléchargement")}. ${_("Veuillez réessayer")}.`
      })
    })

    xhr.open('POST', `${API_URL}/api/post/photo/${this.state.type}`)
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('tk')}`)

    xhr.send(formData)
  }

  uploadPostPhoto() {
    let formData = new FormData()
    formData.append('postPhoto', this.postPhotoFile.current.files[0])

    this.getTagsFormAlt()
    this.setState({isUploading: true})
    this.sendFile(formData)
  }

  getTagsFormAlt() {
    let alt = " " + this.state.alt + " "
    this.forbiddenTagWords.forEach( word => {
      let re = new RegExp(word, 'gi')
      alt = alt.toLowerCase().replace(re, ' ')
    } )
    alt.replace('.','')
    this.setState({tags: alt.trim().split(' ').join(', ')})
  }

  setPhotoInfo(e) {
    e.preventDefault()
    let place = this.state.place
    let tags = this.state.tags
    let body = {}

    if ( place.includes(',') ) place = place.split(',').map( p => p.trim() )
    if ( tags.includes(' ') ) tags = tags.split(',').map( tag => tag.trim() )

    this.setState({loading: true})
    
    body = {
      publicId: this.state.publicId,
      caption: this.state.caption,
      place: {
        city: place[0] ? place[0] : '',
        country: place[1] ? place[1] : ''
      },
      camera: {
        name: this.state.camera,
        shutterSpeed: this.state.shutterSpeed,
        aperture: this.state.aperture,
        focalLength: this.state.focalLength,
        iso: this.state.iso,
      },
      tags: [...tags],
    }

    setPhotoInfo(body)
    .then( res => this.setState({loading: false, hasUpdatedInfo: true}) )
    .catch(err => console.log(err))

  }

  choseFile() {
    if (this.state.isImageLoading) return
    this.postPhotoFile.current.click()
  }

  render() {
    return (
      <div className="site-content col-100">
        <Header />
        <section className="new-post col-100">
        { !this.state.hasUploadedPhoto ?
          <div className="upload-container">
            { !this.state.postPhotoUrl &&   
              <div className="text-content" onClick={this.choseFile}>
                <IconButton id="uploadBtn"
                            onClick={this.choseFile}
                            src={cameraIcon} 
                            size='100px' />
                  <h1>{_("Importer votre photo")}</h1>
                  { this.state.isFileValid ? 
                    <TextSecondary>
                      {_("La résolution de votre photo doit être d’au moins 16 Mega Pixel")}
                    </TextSecondary> :
                    <ErrorMessage message={ this.state.errorMessage }/>
                  }

              </div>
            }
            <input ref={this.postPhotoFile} 
                  type="file" 
                  name="postPhoto" 
                  id="postPhoto"
                  hidden={this.state.isImageLoading && true}
                  onChange={this.renderImage}/>

            { this.state.postPhotoUrl && 
              <div className="image">
                <img src={this.state.postPhotoUrl} alt=""/>
              </div>
            }

            { this.state.hasChosenFile && 
              <div className="overlay dark">
              { !this.state.isUploading &&  
                <IconButton id="closeBtn"
                            onClick={this.resetUpload}
                            src={cancelIcon} 
                            size="18px"/>
              }
                <div className="content">
                  { !this.state.isUploading ? 
                    <div className="controls">
                      <Input name='alt'
                             id='alt'
                             type='text'
                             placeholder={_("Que voit t-on sur la photo")}
                             required={false}
                             value={this.state.alt} 
                             onChange={this.onInputChange}/>
                      <SecondaryButtonBig name='uploadBtn'
                                          id='uploadBtn'
                                          type='button'
                                          onClick={this.uploadPostPhoto}>
                        {_("Télécharger")}
                      </SecondaryButtonBig>
                    </div> :
                    <div className="loading">
                      <span className="col-100">{_("Telechargement en cours")}...</span> 
                      <div className="load col-100">
                        <div className="bar" style={{width: this.state.uploadProgress + '%'}}></div>
                      </div>
                    </div>
                  }

                </div>
              </div>
            }
          </div> :
          <Fragment>
          { !this.state.hasUpdatedInfo ? 
            <div className="form-container">
              <h2>Informations de la photo</h2>
              <Form ref={ this.photoInfoForm } 
                    name="photoInfoForm"
                    onSubmit={ this.setPhotoInfo }>
                <div className="left form-group">
                  <label htmlFor="place">{_("Lieu")}</label>
                  <Input name="place"
                        id="place" 
                        type="text" 
                        placeholder="ex: Abidjan, Côte D'Ivoire"
                        required={true}
                        value={this.state.place} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="camera">{_("Caméra")}</label>
                  <Input name="camera"
                        id="camera" 
                        type="text" 
                        placeholder="ex: Canon EOS 5D Mark III"
                        required={true}
                        value={this.state.camera} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="shutterSpeed">{_("Vitesse d\'obturation")}</label>
                  <Input name="shutterSpeed"
                        id="shutterSpeed" 
                        type="text" 
                        placeholder="ex: 1/100s"
                        required={true}
                        value={this.state.shutterSpeed} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="aperture">{_("Diaphragme")}</label>
                  <Input name="aperture"
                        id="aperture" 
                        type="text" 
                        placeholder="ex: ƒ/10.0"
                        required={true}
                        value={this.state.aperture} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="focalLength">{_("Distance focale")}</label>
                  <Input name="focalLength"
                        id="focalLength" 
                        type="text" 
                        placeholder="ex: 19.0mm"
                        required={true}
                        value={this.state.focalLength} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="iso">ISO</label>
                  <Input name="iso"
                        id="iso" 
                        type="number" 
                        placeholder="ex: 160"
                        required={true}
                        value={this.state.iso} 
                        onChange={ this.onInputChange }/>
                </div>

                <div className="right form-group">
                  <label htmlFor="tags">{_("Categories")}</label>
                  <Input name="tags"
                        id="tags" 
                        type="text" 
                        placeholder="ex: afrique, femme, nature"
                        required={false}
                        value={this.state.tags} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="caption">{_("Legende")}</label>
                  <TextArea name="caption"
                           id="caption"
                           placeholder={_("Donner une légende à votre photo")}
                           required={false}
                           value={this.state.caption}
                           onChange={ this.onInputChange }/>
                  <PrimaryButton name="loginBtn"
                                id="loginBtn"
                                type="submit"
                                loading={ this.state.loading }>
                    {_("Publier la photo")}
                  </PrimaryButton>
                </div>
              </Form>
            </div> :
            <div className="success-message">
              <div className="content">
                <img className="success-icon" alt="success" src={successCheck}/>
                <h2>{_('La photo a été publié avec succes')}</h2>
                <TextSecondary>
                 {_("Vous pouvez consulter votre")} <Link to={'/post/' + this.state.publicId}>
                  <TextButton>{_("photo")}</TextButton></Link> {_("ou revenir à la")} <Link to="/">
                  <TextButton>{_("page d’acceuil")}.</TextButton>
                  </Link> 
                </TextSecondary>
              </div>
            </div>
           }
         </Fragment>
         } 
        </section>
      </div>
    )
  }
}

export default NewPost;
