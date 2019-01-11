# tiny-router
> doesn't handle ur http server

some docs here

usage:
```js
const tr = require('tiny-router')
const router = tr()

router.get('/', (req, res, next) => next())
router.get('/', (req, res) => res.send('oi'))

router.find('GET', '/') // [[Function], [Function]]
```