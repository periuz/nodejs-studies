import http from 'http';
import { json } from './middlewares/json.js';
import { routes } from './routes.js';

// Front-end application can send three types of requestes:
// Query parameters (url stateful - filters on pages) - http://localhost:3333/users?userId=1&name=Thiago
// Route parameters (identify recourse) - http://localhost:3333/users/1 
// Request body (send information to the server using a form)

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    await json(req, res)
    
    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    })

    if (route) {
        const routeParams = req.url.match(route.path);
        req.params = { ...routeParams.groups };

        return route.handler(req, res, req.params)
    }

    res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Not Found' }));

});

server.listen(3333)