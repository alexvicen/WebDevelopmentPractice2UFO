export class DialogData {
  constructor(public message: String | undefined, public scoreTable: ScoreTable | undefined) {
  }
}

export class ScoreTable {
  constructor(public username: String | undefined, public punctuation: number, public ufos: String, public disposedTime: String, public recordDate: String) { }
}

