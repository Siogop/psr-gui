import React from 'react';
import axios from 'axios';

export default class ImageUpload extends React.Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
  }
  handleChange = (e) => {
      console.log("File:", e.target.files[0])
      let file = e.target.files[0]

      if (file) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this)
        reader.readAsBinaryString(file)
      }
  }

  _handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result
    this.setState({
      base64TextString: btoa(binaryString)
    })
  }

  handleUpload = (e) => {
      let file = this.uploadInput.files[0];
      // Split the filename to get the name and type
      let fileParts = this.uploadInput.files[0].name.split('.');
      let fileName = fileParts[0];
      let fileType = fileParts[1];
      console.log("Image: ", file)
      console.log("Preparing the upload");
      var options = {
        headers: {
            'Content-Type': 'application/json'
        }
      }

      axios.post("https://51hwwblj75.execute-api.eu-west-1.amazonaws.com/dev/gettext",{
        imageBase64: this.state.base64TextString,
        fileName: fileName,
        extension: fileType
      }, options)
      .then(response => {
        console.log(response);
        this.setState({text: response.data})
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      })
    }

    render() {
      const { text } = this.state
      return <div>
          <h1>UPLOAD AN IMAGE</h1>
          <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
          <br/>
          <button onClick={this.handleUpload}>UPLOAD</button>
          <br/>
          <h4>TEXT</h4>
          <p>{text}</p>
      </div>;
    }
  }