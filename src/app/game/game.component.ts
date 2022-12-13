import { DialogData, ScoreTable } from './../dialog/dialogData';
import { DialogComponent } from './../dialog/dialog.component';
import { SibligsService } from '../services/siblingsComponentService';

import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, private router: Router, private http: HttpClient, private dialog: MatDialog, private siblingService: SibligsService) { }

  @ViewChild('jet', { static: true }) ship!: ElementRef;
  @ViewChild('board', { static: true }) board!: ElementRef;
  @ViewChild('time', { static: true }) time!: ElementRef;
  @ViewChild('points', { static: true }) points!: ElementRef;
  @ViewChild('playText', { static: true }) playText!: ElementRef;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (!this.isRuning) return;
    switch (event.code) {
      case 'Space':
        this.onKeyUp()
        break
      case 'ArrowUp':
        this.onKeyUp()
        break
      case 'KeyW':
        this.onKeyUp()
        break
      case 'ArrowLeft':
        this.onKeyLeft()
        break
      case 'KeyA':
        this.onKeyLeft()
        break
      case 'ArrowRight':
        this.onKeyRight()
        break
      case 'KeyD':
        this.onKeyRight()
        break
    }
  }

  isRuning = false;
  bullet: HTMLDivElement | undefined;
  gameInterval: NodeJS.Timer | undefined;
  score = 0;

  rectBoard: DOMRect = new DOMRect
  rectShip: DOMRect = new DOMRect
  BOARD_LEFT: number = 0
  BOARD_RIGHT: number = 0
  BOARD_TOP: number = 0
  BOARD_BOTTOM: number = 0
  SHIP_BOTTOM: number = 0
  BOARD_WIDTH: number = 0
  BOARD_HEIGHT: number = 0
  SHIP_WIDTH = 60;
  SHIP_HEIGHT = 80;
  ENEMY_WIDTH = 65;
  ENEMY_HEIGHT = 65;
  BULLET_MOVEMENT = 3;
  SHIP_MOVEMENT = 20;
  ROCKET_MOVEMENT = 5;

  ufoPreference = localStorage["ufoPreference"] || 1;
  timePreference = localStorage["timePreference"] || 60;
  userName = localStorage["userName"] || undefined;
  authorization = localStorage["authorization"] || undefined;

  ngOnInit(): void {
    this.rectBoard = this.board.nativeElement.getBoundingClientRect();
    this.rectShip = this.ship.nativeElement.getBoundingClientRect();

    this.BOARD_LEFT = this.rectBoard.left;
    this.BOARD_RIGHT = this.rectBoard.right;
    this.BOARD_TOP = this.rectBoard.top;
    this.BOARD_BOTTOM = this.rectBoard.bottom;
    this.SHIP_BOTTOM = this.rectShip.bottom;
    this.BOARD_WIDTH = this.BOARD_RIGHT - this.BOARD_LEFT;
    this.BOARD_HEIGHT = this.BOARD_BOTTOM - this.BOARD_TOP;

  }

  ngAfterViewInit() {
    this.createBoard();
  }


  onKeyLeft() {
    var left = parseInt(window.getComputedStyle(this.ship.nativeElement).getPropertyValue("left"));
    if (left <= 0) return
    this.ship.nativeElement.style.left = left - this.SHIP_MOVEMENT + "px";
  }

  onKeyRight() {
    var left = parseInt(window.getComputedStyle(this.ship.nativeElement).getPropertyValue("left"));
    if (left > this.BOARD_WIDTH - this.SHIP_WIDTH * 1.5) return
    this.ship.nativeElement.style.left = left + this.SHIP_MOVEMENT + "px";
  }

  onKeyUp() {
    if (this.bullet != undefined) return
    this.shot();
  }

  shot() {
    this.bullet = this.renderer.createElement('div');
    this.renderer.addClass(this.bullet, "bullets");

    this.bullet!.style.left = this.ship.nativeElement.getBoundingClientRect().left + this.SHIP_WIDTH / 3 + "px";
    this.bullet!.style.bottom = this.ship.nativeElement.getBoundingClientRect().bottom - this.BOARD_HEIGHT + this.SHIP_HEIGHT + "px";
    this.renderer.appendChild(this.board.nativeElement, this.bullet);

    var maxBottom = parseInt(window.getComputedStyle(this.bullet!).getPropertyValue("bottom")) + this.BOARD_HEIGHT - 80;
    var movebullet = setInterval(() => {
      if (!this.isRuning) return;
      var enemies = document.getElementsByClassName("enemies");

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy != undefined) {
          var enemyBound = enemy.getBoundingClientRect();
          var bulletBound = this.bullet?.getBoundingClientRect() || new DOMRect;
          if (
            ((bulletBound.left >= enemyBound.left && bulletBound.left <= enemyBound.right) ||
              (bulletBound.right >= enemyBound.left && bulletBound.right <= enemyBound.right)) &&
            bulletBound.top < enemyBound.bottom
          ) {
            this.addScore();
            enemy.parentElement!.removeChild(enemy);
            if (enemies.length < 1) this.createBoard();
            clearInterval(movebullet);
            document.querySelectorAll(".bullets").forEach(el => el.remove());
            this.bullet = undefined;
            return;
          }
        }
      }
      var bulletBottom = parseInt(window.getComputedStyle(this.bullet!).getPropertyValue("bottom"));
      if (bulletBottom >= maxBottom) {
        this.substractScore();
        clearInterval(movebullet);
        document.querySelectorAll(".bullets").forEach(el => el.remove());
        this.bullet = undefined;
        return;
      }
      this.bullet!.style.bottom = bulletBottom + 3 + "px";
    });
  }

  addScore() {
    this.score += 100;
    this.points.nativeElement.innerHTML = this.score;
  }
  substractScore() {
    this.score -= 25;
    this.points.nativeElement.innerHTML = this.score;
  }

  playPauseGame() {
    this.isRuning = !this.isRuning;
    this.board.nativeElement.focus();
    this.changePlayPauseText();
  }

  changePlayPauseText() {
    if (this.isRuning) this.playText.nativeElement.innerHTML = "Pause";
    else this.playText.nativeElement.innerHTML = "Play";

    if (this.gameInterval != undefined) return;
    var interval = this.timePreference * 1000;
    this.gameInterval = setInterval(() => {
      if (!this.isRuning) return;
      interval -= 1000;
      this.time.nativeElement.innerHTML = interval / 1000;
      if (interval <= 0) {
        clearInterval(this.gameInterval);
        this.isRuning = false;
        this.showErrorDialog();
      }
    }, 1000);
  }

  createBoard() {
    for (var i = 0; i < this.ufoPreference; i++) {
      this.generateEnemy();
    }
  }

  generateEnemy() {
    var rock = this.renderer.createElement('div');
    this.renderer.addClass(rock, "enemies")
    var maxLeft = this.BOARD_LEFT + 5;
    var maxRigh = this.BOARD_RIGHT - this.ENEMY_WIDTH - 5;
    var maxTop = this.BOARD_BOTTOM - this.BOARD_TOP + this.ENEMY_HEIGHT + 5;
    var maxBottom = (this.BOARD_BOTTOM - this.BOARD_TOP) / 2 + this.ENEMY_HEIGHT + 5;

    rock.style.left = Math.floor(Math.random() * (maxRigh - maxLeft + 1)) + maxLeft + "px";
    rock.style.bottom = Math.floor(Math.random() * (maxTop - maxBottom + 1)) + maxBottom + "px";
    this.renderer.appendChild(this.board.nativeElement, rock);
  }

  showErrorDialog() {
    const dialog = this.dialog.open(DialogComponent, { data: this.generateDialogString() })
    dialog.afterClosed().subscribe(art => {
      location.reload();
    });
  }

  generateDialogString(): DialogData {
    return new DialogData(undefined, new ScoreTable(this.userName, this.calculateFinalScore(), this.ufoPreference, this.timePreference, new Date().toLocaleDateString("es-ES")))
  }

  calculateFinalScore(): number {
    var minutesDivider = this.timePreference / 60;
    var ufosSubstract = (this.ufoPreference - 1) * 50;
    return this.score / minutesDivider - ufosSubstract;
  }
}
