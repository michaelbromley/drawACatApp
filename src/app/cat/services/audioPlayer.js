/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('audioPlayer', function(CONFIG, $timeout) {
        var catSounds = {};
        var ballSounds = {};
        var isMuted = false;
        var currentPurrSound;
        var purrIsFadingInOrOut = false;

        function init() {
            catSounds.excited = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'excited-meow-01.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'excited-meow-02.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'excited-meow-03.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'excited-purr-01.mp3', false)
                ];
            catSounds.angry = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'angry-meow-01.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'angry-meow-02.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'angry-meow-03.mp3', false),
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'angry-meow-04.mp3', false)
                ];
            /*catSounds.bored = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'yawn-01.mp3', false)
                ];*/
            catSounds.purr = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'purr-01.mp3', true)
                ];
            ballSounds.soft = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'ball-bounce-soft-01.mp3', false)
            ];
            ballSounds.hard = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'ball-bounce-hard-01.mp3', false)
            ];

            // make the purr a continuous loop (this is a hack to prevent the brief gap in playback)
            angular.forEach(catSounds.purr, function(audioFile) {
                audioFile.addEventListener('timeupdate', function(){
                    var buffer = 1.44;
                    if(this.currentTime > this.duration - buffer){
                        this.currentTime = 0;
                        this.play();
                    }}, false);
            });
        }

        function loadAudioFile(audioFile, loop) {
            var audio = new Audio();
            audio.src = audioFile;
            audio.loop = loop;
            document.body.appendChild(audio);
            return audio;
        }


        function playAudioFile(fileArray, volume) {
            if (!isMuted) {
                var filesCount = fileArray.length;
                var selectedFile = Math.floor(Math.random() * (filesCount));

                if (fileArray[selectedFile].currentTime > 0.1 || fileArray[selectedFile].currentTime === 0) {
                    fileArray[selectedFile].currentTime = 0;
                    fileArray[selectedFile].volume = volume;
                    fileArray[selectedFile].play();
                }
            }
        }

        return {
            init: init,
            excitedMeow: function(emotionVal) {
                playAudioFile(catSounds.excited, emotionVal);
            },
            angryMeow: function(emotionVal) {
                playAudioFile(catSounds.angry, emotionVal);
            },
            yawn: function(emotionVal) {
                playAudioFile(catSounds.bored, emotionVal);
            },
            purrStart: function() {
                var maxVol = isMuted ? 0 : 0.9;
                currentPurrSound = catSounds.purr[0];
                currentPurrSound.volume = 0;
                currentPurrSound.play();
                purrIsFadingInOrOut = true;
                function fadeIn() {
                    if (currentPurrSound.volume < maxVol) {
                        currentPurrSound.volume += 0.02;
                        $timeout(fadeIn, 50);
                    } else {
                        currentPurrSound.volume = 1;
                        purrIsFadingInOrOut = false;
                    }
                }
                fadeIn();
            },
            purrStop: function() {
                purrIsFadingInOrOut = true;
                function fadeOut() {
                    if (0.05 < currentPurrSound.volume) {
                        currentPurrSound.volume -= 0.01;
                        $timeout(fadeOut, 50);
                    } else {
                        currentPurrSound.volume = 0;
                        currentPurrSound.pause();
                        currentPurrSound.currentTime = 0;
                        purrIsFadingInOrOut = false;
                    }
                }
                fadeOut();
            },
            setPurrVolume: function(emotionVal) {
                if (isMuted) {
                    currentPurrSound.volume = 0;
                } else if (!purrIsFadingInOrOut) {
                    currentPurrSound.volume = emotionVal;
                }
            },
            ballBounceSoft: function(velocity) {
                var volume = Math.min(velocity, 50) / 50;
                playAudioFile(ballSounds.soft, volume);
            },
            loadBallSound: function(filename) {
                if (typeof ballSounds[filename] === 'undefined') {
                    ballSounds[filename] = [loadAudioFile(CONFIG.AUDIO_FILES_URL + filename, false)];
                }
            },
            ballBounce: function(filename, velocity) {
                var volume = Math.min(velocity, 50) / 50;
                playAudioFile(ballSounds[filename], volume);
            },
            setAudio: function(val) {
                isMuted = (val !== true);
            },
            reset: function() {
                // stop all audio from playing and set all clips to the start
                function resetSounds(soundCollection) {
                    angular.forEach(soundCollection, function(soundArray) {
                        angular.forEach(soundArray, function(sound) {
                            sound.pause();
                            sound.currentTime = 0;
                        });
                    });
                }

                resetSounds(catSounds);
                resetSounds(ballSounds);
                purrIsFadingInOrOut = false;
            }
        };
    });