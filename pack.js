const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const manifest = require('./manifest.json');

const dir = `./release/${manifest.meta.version}`;

fs.rmdirSync(dir, {
    recursive: true
});
fs.mkdirSync(dir);
fs.mkdirSync(`${dir}/app`);
fs.mkdirSync(`${dir}/app/plugins`);
copyRecursiveSync('./store', `${dir}/store`)

fs.copyFileSync('./CHANGELOG.md', `${dir}/CHANGELOG.md`);
fs.copyFileSync('./manifest.json', `${dir}/app/manifest.json`);
copyRecursiveSync('./assets', `${dir}/app/assets`);
copyRecursiveSync('./dist', `${dir}/app/dist`);
copyRecursiveSync('./plugins/dist', `${dir}/app/plugins/dist`);

zipDirectory(dir, `./release/poe-overlay-overwolf ${manifest.meta.version}.zip`).then(() => {
    fs.rmdirSync(dir, {
        recursive: true
    });
}, error => {
    console.error('could not create zip.', error);
});

function copyRecursiveSync(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}