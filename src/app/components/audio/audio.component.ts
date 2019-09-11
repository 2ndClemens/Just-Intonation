import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {
  // baseFrequency = 1046.5;
  baseFrequency = 220;

  firstTone = true;

  audioCtx = new AudioContext();

  // Audioknoten erzeugen
  oscillatorNodes = [];
  gainNodes = [];
  masterGainNode = this.audioCtx.createGain();
  masterDistNode = this.audioCtx.createWaveShaper();
  masterReverbNode = this.audioCtx.createConvolver();

  distNodes = [];
  notes = [];
  equalNotes = [
    { name: 'C', frequency: 261.6 },
    { name: 'C#', frequency: 277.2 },
    { name: 'D', frequency: 293.7 },
    { name: 'D#', frequency: 311.1 },
    { name: 'E', frequency: 329.6 },
    { name: 'F', frequency: 349.2 },
    { name: 'F#', frequency: 370 },
    { name: 'G', frequency: 392 },
    { name: 'G#', frequency: 415.3 },
    { name: 'A', frequency: 440 },
    { name: 'A#', frequency: 466.2 },
    { name: 'B', frequency: 493.9 }
  ];

  constructor() {}

  ngOnInit() {
    this.masterDistNode.connect(this.audioCtx.destination);
    // this.masterReverbNode.connect(this.audioCtx.destination);
    this.distort(0);
    this.masterGainNode.connect(this.masterDistNode);
    this.masterGainNode.gain.value = 1;
    for (let m = 2; m < 10; m++) {
      for (let n = 1; n < 100; n++) {
        const frequency = (this.baseFrequency / m) * n;
        if (frequency <= this.baseFrequency * 8) {
          this.oscillatorNodes.push(this.audioCtx.createOscillator());
          this.gainNodes.push(this.audioCtx.createGain());
          this.distNodes.push(this.audioCtx.createWaveShaper());
          this.notes.push({
            frequency: frequency,
            started: false,
            playing: false,
            index: this.notes.length,
            name: n + '/' + m,
            row: m,
            col: n
          });
        }
      }
    }
    /* this.notes.push({ frequency: (this.baseFrequency / 8) * 1, playing: false, name: '1/8' });
    this.notes.push({ frequency: (this.baseFrequency / 7) * 1, playing: false, name: '1/7' });
    this.notes.push({ frequency: (this.baseFrequency  / 6) * 1, playing: false, name: '1/6' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 1, playing: false, name: '1/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 4) * 1, playing: false, name: '1/4' });
    this.notes.push({ frequency: (this.baseFrequency  / 7) * 2, playing: false, name: '2/7' });
    this.notes.push({ frequency: (this.baseFrequency  / 8) * 3, playing: false, name: '3/8' });
    this.notes.push({ frequency: (this.baseFrequency  / 3) * 1, playing: false, name: '1/3' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 2, playing: false, name: '2/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 7) * 3, playing: false, name: '3/7' });
    this.notes.push({ frequency: (this.baseFrequency  / 8) * 5, playing: false, name: '5/8' });
    this.notes.push({ frequency: this.baseFrequency  / 2, playing: false, name: '1/2' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 3, playing: false, name: '3/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 7) * 4, playing: false, name: '4/7' });

    this.notes.push({ frequency: (this.baseFrequency  / 3) * 2, playing: false, name: '2/3' });
    this.notes.push({ frequency: (this.baseFrequency  / 7) * 5, playing: false, name: '5/7' });
    this.notes.push({ frequency: (this.baseFrequency  / 4) * 3, playing: false, name: '3/4' });


    this.notes.push({ frequency: (this.baseFrequency  / 5) * 4, playing: false, name: '4/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 6) * 5, playing: false, name: '5/6' });

    this.notes.push({ frequency: (this.baseFrequency  / 7) * 6, playing: false, name: '6/7' });
    this.notes.push({ frequency: (this.baseFrequency  / 8) * 7, playing: false, name: '7/8' });
    this.notes.push({ frequency: this.baseFrequency , playing: false, name: '1' });
    this.notes.push({ frequency: (this.baseFrequency  / 1) * 2, playing: false, name: '2/1' });
    this.notes.push({ frequency: (this.baseFrequency  / 2) * 3, playing: false, name: '3/2' });
    this.notes.push({ frequency: (this.baseFrequency  / 3) * 4, playing: false, name: '4/3' });
    this.notes.push({ frequency: (this.baseFrequency  / 4) * 5, playing: false, name: '5/4' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 6, playing: false, name: '6/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 7, playing: false, name: '7/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 8, playing: false, name: '8/5' });
    this.notes.push({ frequency: (this.baseFrequency  / 5) * 9, playing: false, name: '9/5' });
 */
    // Audiokontext erzeugen

    // Audioknoten verbinden
    for (let n = 0; n < this.oscillatorNodes.length; n++) {
      this.oscillatorNodes[n].connect(this.gainNodes[n]);
      this.gainNodes[n].connect(this.distNodes[n]);
      // this.gainNodes[n].connect(this.audioCtx.destination);

      // Audioknoten konfigurieren
      this.oscillatorNodes[n].type = 'sine';

      this.gainNodes[n].gain.value = 0.2;
      this.oscillatorNodes[n].frequency.value = this.notes[n].frequency / 2;
    }

    // Ausgabe starten
  }

  distort(amount) {
    this.masterDistNode.curve = this.makeDistortionCurve(amount);
  }

  beep(n) {
    if (!this.notes[n].playing) {
      // for (let n = 0; n < this.oscillatorNodes.length; n++) {
      // this.oscillatorNodes[n].start();

      this.distNodes[n].connect(this.masterGainNode);
      this.distNodes[n].curve = this.makeDistortionCurve(0);
      this.notes[n].playing = true;
      if (!this.oscillatorNodes[n].started) {
        this.oscillatorNodes[n].start();
        this.oscillatorNodes[n].started = true;
      }
    } else {
      // this.oscillatorNodes[n].stop();
      this.distNodes[n].disconnect(this.masterGainNode);
      this.notes[n].playing = false;
    }
    //  }
  }
  silence() {
    for (let n = 0; n < this.gainNodes.length; n++) {
      if (this.notes[n].playing === true) {
        this.distNodes[n].disconnect(this.masterGainNode);
        this.notes[n].playing = false;
      }
    }
  }

  transpose() {
    for (let n = 0; n < this.gainNodes.length; n++) {
      this.notes[n].frequency = this.oscillatorNodes[n].frequency.value =
        ((this.baseFrequency / this.notes[n].row) * this.notes[n].col) / 2;
    }
  }

  makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 0,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  playNote(n) {
    this.beep(n);
  }

  playChord(notes) {
    this.silence();
    for (let n = 0; n < notes.length; n++) {
      setTimeout(() => {
        this.playNote(this.notes.find(note => note.name === notes[n]).index);
      }, n * 10);
    }
    // const n = 3;
  }
  setFrequency(frequency) {
    this.baseFrequency = frequency;
    this.transpose();
  }
}
