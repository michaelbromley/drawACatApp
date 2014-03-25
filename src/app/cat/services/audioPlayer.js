/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('audioPlayer', function(CONFIG, $timeout) {
        var catSounds = {};

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
            return fileArray[selectedFile];
        }

        return {
            init: init,
            excitedMeow: function() {
                getAudioFile(catSounds.excited).play();
            },
            angryMeow: function() {
                getAudioFile(catSounds.angry).play();
            },
            yawn: function() {
                getAudioFile(catSounds.bored).play();
            },
            purrStart: function() {
                var purrSound = catSounds.purr[0];
                purrSound.volume = 0;
                purrSound.play();
                function fadeIn() {
                    purrSound.volume += 0.02;
                    if (purrSound.volume < 0.9) {
                        $timeout(fadeIn, 50);
                    } else {
                        purrSound.volume = 1;
                    }
                }
                fadeIn();
            },
            purrStop: function() {
                var purrSound = catSounds.purr[0];
                purrSound.play();
                function fadeOut() {
                    purrSound.volume -= 0.01;
                    if (0.1 < purrSound.volume) {
                        $timeout(fadeOut, 50);
                    } else {
                        purrSound.volume = 0;
                        purrSound.pause();
                        purrSound.currentTime = 0;
                    }
                }
                fadeOut();
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