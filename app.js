const fs = require('fs/promises');


(async () => {

    const CREATE_FILE = 'create a file'
    const DELETE_FILE = 'delete the file'
    const RENAME_FILE = 'rename the file'
    const ADD_TO_FILE = 'add to the file'

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

    const deleteFile = async (filePath) => {

        try {
            //now we should delete the file
            await fs.unlink(filePath);
            console.log(`The file ${filePath} was deleted successfully`)
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log("No file at this path to remove.")
            } else {
                console.log("An error occurred while removing the file.")
            }
        }
    }

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath);
            console.log(`The file ${oldPath} was renamed to ${newPath} successfully`)
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.log("No file at this path to name.")
            } else {
                console.log("An error occurred while renamin the file.")
            }
        }
    }

    let addedContent ;

    const addToFile = async (filePath, content) => {
        if(addedContent === content) return;

        try {
            console.log("FilePath:" + filePath)
            console.log("Content:" + content)
            const fileHandle = await fs.open(filePath, "a");
            fileHandle.write(content);
            addedContent = content;
            fileHandle.close();
            console.log("The content was added succesfully.")
        } catch (error) {
            console.log('An error occurred while adding content to the file.')
        }
    }


    const commandFileHandler = await fs.open('./command.txt', 'r');

    // This is an event-driven pattern in Node.js, specifically using an event emitter.
    commandFileHandler.on('change', async () => {
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
        //delete a file
        //delete a file: <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            deleteFile(filePath);
        }
        //rename a file
        //rename a file: <path> <newPath>
        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(' to ');
            const oldPath = command.substring(RENAME_FILE.length + 1, _idx);
            const newPath = command.substring(_idx + 4);
            renameFile(oldPath, newPath);
        }
        //add to a file
        //add to a file: <path> <content>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(" this content: ");
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
            const content = command.substring(_idx + 15);
            addToFile(filePath, content);

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
