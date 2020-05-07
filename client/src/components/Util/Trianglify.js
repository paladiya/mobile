import Trianglify from 'trianglify'

const TrianglifyGenerate = (props) => Trianglify({
  width: 300,
  height: 300,
  cell_size: 80,
  x_colors: 'random',
  variance: Math.random()
})

export default TrianglifyGenerate
