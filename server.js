const express = require('express')
const multer = require('multer')
const jpeg = require('jpeg-js')

const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')
const axios = require('axios') //you can use any http client

const app = express()
const upload = multer()

let _model

const convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const image = await jpeg.decode(img, true)

  const numChannels = 3
  const numPixels = image.width * image.height
  const values = new Int32Array(numPixels * numChannels)

  for (let i = 0; i < numPixels; i++)
    for (let c = 0; c < numChannels; ++c)
      values[i * numChannels + c] = image.data[i * 4 + c]

  return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32')
}

app.get('/nsfw', async (req, res) => {
	  async function fn() {
		    const pic = await axios.get(req.query.url, {
			        responseType: 'arraybuffer',
			      })
		    const image = await tf.node.decodeImage(pic.data,3)
		    const predictions = await _model.classify(image)
		    image.dispose() 
		    res.json(predictions)
	  }
	  fn()
  
})

const load_model = async () => {
  _model = await nsfw.load()
}

// Keep the model in memory, make sure it's loaded only once
load_model().then(() => app.listen(8010))
