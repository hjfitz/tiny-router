class Router {
	constructor() {
		this.middleware = {	GET: {}, HEAD: {}, OPTIONS: {}, POST: {}, PUT: {}, PATCH: {}, DELETE: {} }
		this.all = this.add.bind(this, '*')
		this.use = this.add.bind(this, '*')
		this.get = this.add.bind(this, 'GET')
		this.head = this.add.bind(this, 'HEAD')
		this.patch = this.add.bind(this, 'PATCH')
		this.options = this.add.bind(this, 'OPTIONS')
		this.delete = this.add.bind(this, 'DELETE')
		this.post = this.add.bind(this, 'POST')
		this.put = this.add.bind(this, 'PUT')
		this.mwCount = 0 // do some perfy shid here
	}

	add(method, url, ...middlewares) {
		if (method !== '*') {
			const cur = this.middleware[method]
			url in cur ? cur[url].push(...middlewares) : cur[url] = [...middlewares]
			return this
		}
		Object.keys(this.middleware).forEach(curMethod => this.add(curMethod, url, ...middlewares))
		return this
	}

	find(method, url) {
		const mws = this.middleware[method]
		return mws ? [...mws[url]] || [] : []
	}
}

module.exports = () => new Router()
