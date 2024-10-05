const fs = require('fs/promises');

(async () => {
    const commandFileHandler = await fs.open('./command.txt', 'r');

    const watcher = fs.watch('./command.txt');
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            // the file was changed
            console.log("The file was Changed")
            // we want to read the content of the file
            const content = await commandFileHandler.read(Buffer.alloc(8));
            console.log(content);

        }
    }
})();
