import {Component, OnInit, ViewChild, Input, AfterViewInit, EventEmitter, Output} from '@angular/core';
import {ElementRef} from '@angular/core';
import {File} from '../models/file.model';

@Component({selector: 'fex-player', templateUrl: './player.component.html', styleUrls: ['./player.component.scss']})
export class PlayerComponent implements OnInit {

  @ViewChild('audio')audio: ElementRef;

  audioElement: HTMLMediaElement;

  @Input()src;
  @Input()state;


  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();

  value = 0;
  step = 1;
  min = 0;
  max = 100;
  volume = 5;

  thumbLabel = true;

  constructor() {}

  ngOnInit() {
    this.audioElement = this.audio.nativeElement;

    this.audioElement.onloadedmetadata = e => {
      this.max = this.audioElement.duration;
      this.play();
    };

    this.audioElement.ontimeupdate = e => {
      this.value = this.audioElement.currentTime;
    };
  }

  onSeekerChange(event) {
    this.value = event;
    this.audioElement.currentTime = event.value;
  }

  onVolumeChange(event) {
    const volume = event.value / 100;
    this.audioElement.volume = volume;
  }

  getTime() {
    const sec = this.audioElement.currentTime || 0;
    const duration = this.audioElement.duration || 0;

    return `${this.toHHMMSS(sec)} / ${this.toHHMMSS(duration)}`;

  }

  toHHMMSS (time) {
    const sec_num = parseInt(time, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);

    let hourLabel = hours.toString(),
      minuteLabel = minutes.toString(),
      secondLabel = seconds.toString();

    if (hours < 10) {
      hourLabel = '0' + hours;
    }
    if (minutes < 10) {
      minuteLabel = '0' + minutes;
    }
    if (seconds < 10) {
      secondLabel = '0' + seconds;
    }

    return (hours > 0 ? hourLabel + ':' : '') + minuteLabel + ':' + secondLabel;
  }

  onPlayPauseClick(event) {
    if (!this.state.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.state.playing = true;
    this
      .audioElement
      .play();
  }

  pause() {
    this.state.playing = false;
    this
      .audioElement
      .pause();
  }

  stop() {
    this
      .audioElement
      .pause();
  }

  skipNext(event) {
    this.next.emit(true);
  }

  skipPrevious(event) {
    this.previous.emit(true);
  }

}
