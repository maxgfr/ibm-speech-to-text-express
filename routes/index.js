var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY
  }),
  url: process.env.SPEECH_TO_TEXT_URL,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/speech', upload.any(), function(req, res, next) {
  //console.log(req.body, req.files);
  fs.writeFile('./upload/'+req.files[0].originalname+'.wav', req.files[0].buffer, (err) => {
        if (err) {
            console.log(err);
            res.json({error: err, success: false});
        } else {
          const params = {
            audio: fs.createReadStream('./upload/blob.wav'),
            contentType: 'audio/l16; rate=44100'
          };
          speechToText.recognize(params)
            .then(response => {
              console.log(JSON.stringify(response.result, null, 2));
              res.json({result: response.result, success: true});
            })
            .catch(err => {
              console.log(err);
              res.json({error: err, success: false});
            });
        }
    });
})

module.exports = router;
