import fs from 'fs-extra'
import path from 'path'

export const run = async ({ state, element, events, iteration }) => {
  
  const config = state.config = {
  	trainImagesPath: path.join(__dirname, '/data/train-images-idx3-ubyte'),
    trainLabelsPath: path.join(__dirname, '/data/train-labels-idx1-ubyte'),
    testImagesPath: path.join(__dirname, '/data/t10k-images-idx3-ubyte'),
		testLabelsPath: path.join(__dirname, '/data/t10k-labels-idx1-ubyte'),
    width: 28,
    height: 28,
    size: 28 * 28,
    imageOffset: 16,
    labelOffset: 8
  }
  
  const toArrayBuffer = buffer => {
    var ab = new ArrayBuffer(buffer.length)
    var view = new Uint8Array(ab)
    for (var i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i]
    }
    return ab
  }
  
  const loadArray = (path, offset) => {
    var arr = new Uint8Array(toArrayBuffer(fs.readFileSync(path)))
    if(offset){
      arr = arr.slice(offset)
    }
    return arr
  }
  
  const loadImages = path => {
   	const arr = loadArray(path, config.imageOffset)
    const images = []
    const totalImages = arr.length / config.size
    for(var i=0; i<totalImages; i++){
      const offset = i * config.size
      const image = new Float64Array(arr.subarray(offset, offset + config.size))
      for(var x=0; x<image.length; x++){
	    	image[x] /= 255
      }
      images.push(image)
    }
    return images
  }
  
  const loadLabels = path => {
    return loadArray(path, config.labelOffset)
  }
  
  state.train = {
    images: loadImages(config.trainImagesPath),
    labels: loadLabels(config.trainLabelsPath)
  }
  
  state.test = {
    images: loadImages(config.testImagesPath),
    labels: loadLabels(config.testLabelsPath)
  }
}
