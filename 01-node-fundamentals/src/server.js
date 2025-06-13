import http from 'http';

const users = []

const server = http.createServer((req, res) => {
    const { method, url } = req;
    
    if (method === 'GET' && url === '/users') {
        return res
            .setHeader('Content-Type', 'application/json')
            .writeHead(200)
            .end(JSON.stringify(users));

        
    }

    if (method === 'POST' && url === '/users') {
        users.push({
            name: "john doe",
            id: Math.floor(Math.random() * 1000)
        })

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'created' }));
    }

    res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Not Found' }));

});

server.listen(3333)