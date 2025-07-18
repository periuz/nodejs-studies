// path: '/users/:id',

export function buildRodePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)' )

    const pathRegex = new RegExp(`^${pathWithParams}`)

    return pathRegex;
}