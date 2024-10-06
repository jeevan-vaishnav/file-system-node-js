const fs = require('fs/promises');

(async () => {
    const commandFileHandler = await fs.open('./command.txt', 'r');

    // This is an event-driven pattern in Node.js, specifically using an event emitter.
    commandFileHandler.on('change', async () => {
        // the file was changed
        console.log("The file was Changed")
        //get the size of the file
        const statSize = (await commandFileHandler.stat()).size;
        //allocate our buffer with size of file
        const buff = Buffer.alloc(statSize);
        // the location at which we want to start filling our buffer
        const offset = 0;
        //how may bytes we want to read
        const length = buff.byteLength;
        //the position that we wnat to starting reading the file from 
        const position = 0;
        // We always want to read the whole conent ( form begning all the way to the end)
        await commandFileHandler.read(buff, offset, length, position);
        // console.log(buff.toString('utf-8'));

        /**
         * decoder 01 -> meanigful
         * encode meaningful -> 01
         */
        const command = buff.toString('utf-8');
        

    })

    //create a watcher
    const watcher = fs.watch('./command.txt');
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            // function emit 
            commandFileHandler.emit('change');

        }
    }
})();
