const express = require('express');
const bodyParser = require('body-parser');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const apiKey = 'YOUR_API_KEY'; // Replace with your Watson Visual Recognition API key
const apiUrl = 'YOUR_API_URL'; // Replace with your Watson Visual Recognition API URL

const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    authenticator: new IamAuthenticator({
        apikey: apiKey,
    }),
    url: apiUrl,
});

app.post('/recognize', (req, res) => {
    const imageFile = req.files.image; // Assuming you're using Express.js and the `express-fileupload` middleware
    const params = {
        images_file: imageFile.data,
    };

    visualRecognition.classify(params)
        .then(response => {
            const classes = response.result.images[0].classifiers[0].classes;
            const topClass = classes[0].class;
            res.json({ result: topClass });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
