import fs from 'fs'
import { images } from '@packages/files'
import { useImagenes } from './controller.js'

export default useImagenes({ images, fs })
