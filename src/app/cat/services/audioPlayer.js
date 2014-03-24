/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('audioPlayer', function(CONFIG) {
        var catSounds = {};

        function loadAudioFile(audioFile, loop) {
            var audio = new Audio();
            audio.src = audioFile;
            audio.loop = loop;
            document.body.appendChild(audio);
            return audio;
        }

        function init() {
            catSounds.excited = loadAudioFile(CONFIG.AUDIO_FILES_URL + 'excited-meow-01.mp3', false);
            catSounds.angry = loadAudioFile(CONFIG.AUDIO_FILES_URL + 'angry-meow-01.mp3', false);
            catSounds.purr = loadAudioFile(CONFIG.AUDIO_FILES_URL + 'purr-01.mp3', true);
            catSounds.purr.addEventListener('timeupdate', function(){
                var buffer = 1.44;
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0;
                    this.play();
                }}, false);
        }

        return {
            init: init,
            excitedMeow: function() {
                catSounds.excited.play();
            },
            angryMeow: function() {
                catSounds.angry.play();
            },
            purrStart: function() {
                catSounds.purr.play();
            },
            purrStop: function() {
                catSounds.purr.pause();
                catSounds.purr.currentTime = 0;
            },
            setAudio: function(val) {
                var volume = (val === true) ? 1 : 0;
                angular.forEach(catSounds, function(sound) {
                    sound.volume = volume;
                });
            }
        };
    });