import { middleware as authed } from '@packages/auth'
import { middleware as upload } from '@packages/files'
import { useRouter } from '@packages/router'

export default ({ $endpoint }) => useRouter({
  '/:id': {
    get: [ authed, $endpoint.findOne ],
    patch: [
      authed,
      upload.fields([
        { name: 'prePublicacion', maxCount: 1 },
        { name: 'bundleAndroid', maxCount: 1 },
        { name: 'bundleIOS', maxCount: 1 },
        { name: 'imagenes', maxCount: 10 },
      ]),
      $endpoint.update,
    ],
    delete: [ authed, $endpoint.remove ],
  },
  '/': {
    get: [ authed, $endpoint.findMany ],
    post: [
      authed,
      upload.fields([
        { name: 'prePublicacion', maxCount: 1 },
        { name: 'bundleAndroid', maxCount: 1 },
        { name: 'bundleIOS', maxCount: 1 },
        { name: 'imagenes', maxCount: 10 },
      ]),
      $endpoint.insert,
    ],
  },
})
