const fs = require('fs/promises');


(async () => {

    const CREATE_FILE = 'create a file'

    const createFile = async (filePath) => {

        try {
            //we want to check whether the file already exists
            const existingFileHandle = await fs.open(filePath, 'r');
            //we already have that file
            existingFileHandle.close();

            return console.log(`The file ${filePath} already exists`)
        } catch (error) {
            // ..we dont have file , now we should create it
            const newFileHandle = await fs.open(filePath, 'w');
            console.log(`The file ${newFileHandle} was created successfully`)
            newFileHandle.close();
        }
    }

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

        // create a file:
        // create a file: <path>
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            console.log("File Path: " + filePath)
            createFile(filePath);
        }
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
