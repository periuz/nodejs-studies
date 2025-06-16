import http from 'http';
import { Transform } from 'node:stream';

class InvertNumberStrem extends Transform {
    _transform (chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1;

        console.log(transformed);

        callback(null, Buffer.from(String(transformed)));
    }
}

// req - readable strem
// res - writable stream


// We can use the request as a readable stream and the response as a writable stream
// IN THIS CASE, we read a request and then, when it is finished (read in total), write the response 
const server = http.createServer(async (req, res) => {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    const fullStreamContent = Buffer.concat(buffers).toString('utf-8');

    console.log(fullStreamContent);

    return res.end(fullStreamContent);
    
    // return req.pipe(new InvertNumberStrem())
    // .pipe(res)
});

server.listen(3334);