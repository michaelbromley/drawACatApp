/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('audioPlayer', function(CONFIG, $timeout) {
        var catSounds = {};
        var ballSounds = {};
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
            catSounds.bored = [
                loadAudioFile(CONFIG.AUDIO_FILES_URL + 'yawn-01.mp3', false)
                ];
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


        function getAudioFile(fileArray) {
            var filesCount = fileArray.length;
            var selectedFile = Math.floor(Math.random() * (filesCount));
            fileArray[selectedFile].currentTime = 0;
            return fileArray[selectedFile];
        }

        return {
            init: init,
            excitedMeow: function(emotionVal) {
                var sound = getAudioFile(catSounds.excited);
                sound.volume = emotionVal;
                sound.play();
            },
            angryMeow: function(emotionVal) {
                var sound = getAudioFile(catSounds.angry);
                sound.volume = emotionVal;
                sound.play();
            },
            yawn: function(emotionVal) {
                var sound = getAudioFile(catSounds.bored);
                sound.volume = emotionVal;
                sound.play();
            },
            purrStart: function() {
                currentPurrSound = catSounds.purr[0];
                currentPurrSound.volume = 0;
                currentPurrSound.play();
                purrIsFadingInOrOut = true;
                function fadeIn() {
                    currentPurrSound.volume += 0.02;
                    if (currentPurrSound.volume < 0.9) {
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
                    currentPurrSound.volume -= 0.01;
                    if (0.1 < currentPurrSound.volume) {
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
                if (!purrIsFadingInOrOut) {
                    currentPurrSound.volume = emotionVal;
                }
            },
            ballBounceSoft: function(velocity) {
                var bounceSound = getAudioFile(ballSounds.soft);
                bounceSound.volume = Math.min(velocity, 10) / 10;
                bounceSound.play();
            },
            ballBounceHard: function(velocity) {
                var bounceSound = getAudioFile(ballSounds.hard);
                bounceSound.volume = Math.min(velocity, 10) / 10;
                bounceSound.play();
            },
            setAudio: function(val) {
                var volume = (val === true) ? 1 : 0;
                angular.forEach(catSounds, function(soundArray) {
                    angular.forEach(soundArray, function(sound) {
                        sound.volume = volume;
                    });
                });
            }
        };
    });