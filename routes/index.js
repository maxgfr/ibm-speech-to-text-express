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

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/speech', upload.any(), function(req, res, next) {
  //console.log(req.body, req.files);
  /* fs.writeFile('./upload/'+req.files[0].originalname+'.wav', req.files[0].buffer, (err) => {
          if (err) {
              console.log(err);
              res.json({error: err, success: false});
          } else {
            console.log('success');
          }
      }); */
  const recognizeParams = {
    audio: req.files[0].buffer,
    contentType: req.files[0].mimetype,
    model: 'fr-FR_BroadbandModel'
  };
  speechToText.recognize(recognizeParams)
    .then(response => {
      //console.log(JSON.stringify(response.result, null, 2));
      res.json({result: response.result.results, success: true});
    })
    .catch(err => {
      console.log(err);
      res.json({error: err, success: false});
    });
});

module.exports = router;
