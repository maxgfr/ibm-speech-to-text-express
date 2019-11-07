class AudioRecorder {

  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = null;
  }

  init = async () => {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.audioChunks = [];
    this.mediaRecorder.addEventListener("dataavailable", event => {
      this.audioChunks.push(event.data);
    });
  }

  start = () => this.mediaRecorder.start();

  stop = () => new Promise(resolve => {
        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(this.audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        this.mediaRecorder.stop();
      });
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const audioRecorder = new AudioRecorder();
audioRecorder.init();
var audio = null;

const startRecording = () => {
  const startButton = document.getElementById('start');
  startButton.disabled = true;
  const stopButton = document.getElementById('stop');
  stopButton.disabled = false;
  audioRecorder.start();
}

const stopRecording = async () => {
  const stopButton = document.getElementById('stop');
  stopButton.disabled = true;
  const startButton = document.getElementById('play');
  startButton.disabled = false;
  const analyseButton = document.getElementById('analyse');
  analyseButton.disabled = false;
  audio = await audioRecorder.stop();
}

const playRecording = () => {
  audio.play();
}

const analyze = async () => {
  var fd = new FormData();
  fd.append('url', audio.audioUrl);
  fd.append('blob', audio.audioBlob);
  $.ajax({
      method: 'POST',
      url: '/speech',
      data: fd,
      processData: false,
      contentType: false
  }).done((data) => {
      //console.log(data);
      document.getElementById("res").innerHTML = data.result[0].alternatives[0].transcript;
  });

}
