const express = require('express');
const fileUpload = require('express-fileupload');
const { PORT, views, temp, uploadsFolder } = require('./config');
const setupMiddlewares = require('./middlewares');
const Jpeg = require('./entities/Jpeg');
const db = require('./entities/Database');
const { existsSync } = require('fs');
const path = require('path');
const fs = require('fs');
const { replaceBackground } = require("backrem");

const app = express();

//setup view engine
app.set('view engine', 'ejs');
app.set('views', views);

//setup temp folder
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: temp,
    createParentPath: true,
}));

//setup middlewares
setupMiddlewares(app);

app.get('/', async (req, res, next) => {
    res.render('index');
});

app.post('/upload', async (req, res, next) => {
    try {
        const file = req.files.image;
        const { size } = file;
        const jpegFile = new Jpeg({size});
        await db.insert(jpegFile, file);
        res.send(jpegFile);
    } catch (error) {
        console.log(error);
        res.send('Error uploading a file');
    }
});

app.get('/list', (req, res) => {
    const allJpegs = db.find().map((jpeg) => jpeg.toJSON());
    return res.json(allJpegs);
});

app.get('/image/:id', (req, res) => {
    const jpegId = req.params.id;
    const jpegPath = path.join(uploadsFolder, `${jpegId}_original.jpeg`);

    fs.readFile(jpegPath, function(err, content) {
        if (err) {
          res.writeHead(404, { "Content-type": "text/html" });
          res.end("<h1>No such image</h1>");
        } else {
          res.writeHead(200, { "Content-type": "image/jpeg" });
          res.end(content);
        }
    });
});

app.delete('/image/:id', async (req, res) => {
    const jpegId = req.params.id;
    const id = await db.remove(jpegId);
    if(id){
        return res.json({ id });
    } else {
        res.send("image doesn't exist");
    }
});

app.get('/merge', async (req, res) => {
    const params = req.query;
    const { front, back, color, threshold } = params;

    const pathFront = path.join(uploadsFolder, `${front}_original.jpeg`);
    const pathBack = path.join(uploadsFolder, `${back}_original.jpeg`);

    if (!existsSync(pathFront)){
        res.writeHead(404, { "Content-type": "text/html" });
        res.end(`Couldn't find front image file`);
    } else if(!existsSync(pathBack)){
        res.writeHead(404, { "Content-type": "text/html" });
        res.end(`Couldn't find background image file`);
    } else {
        const frontPath = fs.createReadStream(pathFront);
        const backPath = fs.createReadStream(pathBack);
        const colorToChange = color.split(',').map(el => Number(el));
        replaceBackground(frontPath, backPath, colorToChange, threshold).then(
            (readableStream) => {
                res.writeHead(200, { "Content-type": "image/jpeg" });
                readableStream.pipe(res);
            }
        ).catch(err => {
            res.writeHead(404, { "Content-type": "text/html" });
            res.end(`Error "${err.message}" occured while changing background of a file`);
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});