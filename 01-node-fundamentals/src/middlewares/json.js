//Middleware is a interceptor that can modify the request or response objects

export async function json (req, res) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString('utf-8'));
    } catch {
        req.body = null;
    }

    res
        .setHeader('Content-Type', 'application/json')
}

