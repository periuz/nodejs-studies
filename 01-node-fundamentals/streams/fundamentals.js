// Read small parts of something and be able to work with them
// Import clientes from CSV (excel) - imagine a CSV file with 1GB of data]

//1GB - with 1.000.000 lines
//POST /upload import.csv
//Imagine a network with 10mb/s / it will take 100 seconds to upload
//After 100 seconds, we will have the data in memory
//But, with streams, we can read the file in small chunks
// Like 10mb/s -> 10.000 lines

//Its very commom connect streams to other streams
// process.stdin
//     .pipe(process.stdout);

import { Readable, Transform } from 'node:stream';
import { Writable } from 'node:stream';


class OneToHundredStream extends Readable {
    index = 1;
    
    _read() {
        const i =  this.index++;
        setTimeout (() => {
            if (i > 100) {
                this.push(null); // Signal that there is no more data to read
            } else {
                const buf = Buffer.from(String(i) + '\n', 'utf-8');

                this.push(buf); // Push the current number as a buffer
            }
        }, 10);
    }
};

class MultiplyByTenStream extends Writable {
    _write(chunk, _, callback) {
        console.log(Number(chunk.toString()) * 10);
        callback(); // Signal that the write is complete
    }
}

class InvertNumberStrem extends Transform {
    _transform (chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1;
        callback(null, Buffer.from(String(transformed)));
    }
}

new OneToHundredStream()
    .pipe(new InvertNumberStrem())
    .pipe(new MultiplyByTenStream())