import { Readable, Writable, Transform } from 'node:stream';

class OneToHundredStream extends Readable {
    index = 1;
    
    _read() {
        const i =  this.index++;
        setTimeout (() => {
            if (i > 5) {
                this.push(null); // Signal that there is no more data to read
            } else {
                const buf = Buffer.from(String(i) + '\n', 'utf-8');

                this.push(buf); // Push the current number as a buffer
            }
        }, 100);
    }
};

fetch('http://localhost:3334/upload', {
    method: 'POST',
    body: new OneToHundredStream(),
    duplex: 'half'
}).then( response => {
    response.text()
}).then(data => {
    console.log(data);
})