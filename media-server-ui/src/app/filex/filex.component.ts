import { Component, OnInit } from '@angular/core';
import { MediaService } from '../services/media.service';
import { File } from '../models/file.model';
import { DefaultPlayerState } from '../player/player-state.interface';
import * as Fuse from 'fuse.js';


@Component({ selector: 'ms-filex', templateUrl: './filex.component.html', styleUrls: ['./filex.component.scss'] })
export class FilexComponent implements OnInit {

  constructor(private fileService: MediaService) { }

  fileList: File[];
  selectedFile: File;

  playerState = DefaultPlayerState;

  previousIndexes: number[] = [];

  options;
  fuse;


  ngOnInit() {

    this
      .fileService
      .getTracks()
      .subscribe(res => {
        this.fileList = res.docs;
        this.selectedFile = this.shuffleNext();
        this.setPlayingFileSrc(this.selectedFile._id);

        this.fuse = new Fuse(this.fileList, this.options);


        console.log(this.fuse.search('Bry'));

      });

    this.options = {
      shouldSort: true,
      threshold: 1,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name',
        'path'
      ]
    };

  }

  onFileClicked(file: File) {
    this.selectedFile = file;
    this.setPlayingFileSrc(file._id);
  }

  setPlayingFileSrc(id) {
    this.selectedFile.src = this.fileService.FILE_URL + id;
  }

  skipNext(event) {
    let index = this
      .fileList
      .indexOf(this.selectedFile);

    if (this.playerState.shuffle) {
      this.selectedFile = this.shuffleNext();
    } else {
      this.selectedFile = this.fileList[++index];
    }

    this.setPlayingFileSrc(this.selectedFile._id);
  }

  skipPrevious(event) {
    let index = this
      .fileList
      .indexOf(this.selectedFile);

    index -= 1;

    if (this.previousIndexes.length > 0) {
      this.selectedFile = this.fileList[this.previousIndexes[this.previousIndexes.length - 1]];
    } else {
      this.selectedFile = this.fileList[index];
    }

    console.log(index, this.previousIndexes, this.selectedFile);

    this.setPlayingFileSrc(this.selectedFile._id);
  }

  shuffleNext() {
    const rand = Math.floor(Math.random() * this.fileList.length + 1);

    if (this.previousIndexes.length > 20) {
      this.previousIndexes.push(rand);
      this.previousIndexes = this.previousIndexes.slice(this.previousIndexes.length - 21, this.previousIndexes.length - 1);
    } else {
      this.previousIndexes.push(rand);
    }


    // console.log(this.previousIndexes, this.previousIndexes.slice(this.previousIndexes.length - 21, this.previousIndexes.length - 1));

    return this.fileList[rand];
  }

  onStateChanged(event) {
    this.playerState = event;
  }


  onFileSeach(event) {

    console.log(event);
    if (event.length > 0) {
      this.fileList = this.fuse.search(event);
    }



  }

}
