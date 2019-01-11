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
	}

	prep() {
		const all = this.middleware['*']

		// apply all '*' to each method
		// go through each verb we currently have
		if (all) {
			Object.keys(this.middleware).forEach((verb) => {
				if (verb === '*') return
				const middlewares = this.middleware[verb]
				// go through each url on the middleware
				Object.keys(all).forEach((url) => {
					if (url in middlewares) middlewares[url].push(...all[url])
					else middlewares[url] = [...all[url]]
				})
			})
		}

		// append wildcards to each url
		Object.keys(this.middleware).forEach((verb) => {
			const mwStack = this.middleware[verb]
			const wildcard = mwStack['*']
			Object.keys(mwStack).forEach((url) => {
				if (url === '*') return
				let curStack = mwStack[url]
				if (wildcard) curStack.push(...wildcard)
				curStack = curStack.sort((mw1, mw2) => {
					if (mw1.idx < mw2.idx) return -1
					if (mw1.idx > mw2.idx) return 1
					return 0
				})
			})
		})
	}


	add(method, url, middleware) {
		if (typeof url === 'string' && middleware) return this.addMw(method, url, middleware)
		if (url instanceof Function) return this.addMw(method, '*', url)
		throw new Error('should not get here')
	}

	addMw(method, url, middleware) {
		const newWare = { func: middleware, idx: this.mwCount }

		if (!(method in this.middleware)) this.middleware[method] = {}
		if (!(url in this.middleware[method])) this.middleware[method][url] = [newWare]
		else this.middleware[method][url].push(newWare)

		this.mwCount += 1
		this.prep()
		return this
	}

	find(method, url) {
		const mws = this.middleware[method]
		const rawMws = mws[url || '*'] || mws['*'] || []

		// shallow clone so resp has it's own queue
		return [...rawMws]
	}
}

module.exports = () => new Router()
