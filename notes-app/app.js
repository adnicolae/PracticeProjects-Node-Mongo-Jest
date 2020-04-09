const yargs = require('yargs');
const notes = require('./notes');

// Customize yargs version
yargs.version('1.1.0')

yargs.command('add', 'Add a new note', {
    title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string'
    },
    body: {
        describe: 'Note description',
        demandOption: true,
        type: 'string'
    }
}, (argv) => notes.addNote(argv.title, argv.body));

// Create remove command
yargs.command('remove', 'Remove a note', {
    title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string'
    }
}, (argv) => {
    notes.removeNote(argv.title);
});

// Create list command
yargs.command('list', 'list a note', () => {
    notes.listNotes();
});

// Create read command
yargs.command('read', 'read a note', {
    title: {
        describe: 'Note title',
        demandOption: true,
        type: 'string'
    }
}, (argv) => {
    notes.readNote(argv.title);
});

yargs.parse();