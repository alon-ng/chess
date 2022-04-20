class BoardData {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
  }

  createBoard() {
    // Defining table element
    let table = document.createElement('table');
    // Appending table to body element
    document.getElementsByClassName('chess-div')[0].appendChild(table);

    let r = document.createElement('tr');
    table.appendChild(r);
    r.appendChild(document.createElement('th'));
    for (let i = 0; i < boardSize; i++) {
      let h = document.createElement('th');
      h.classList.add('chess-board-label');
      h.innerHTML = String.fromCharCode('A'.charCodeAt(0)+ i);
      r.appendChild(h)
    }
    // for loop for creating the board squares
    for (let y = 0; y < boardSize; y++) {
      // running and creating the rows (y-axis)
      let row = document.createElement('tr');
      let counter = document.createElement('th');
      counter.innerHTML = y + 1;
      counter.classList.add('chess-board-label');
      row.appendChild(counter);
      // Defining the row
      for (let x = 0; x < boardSize; x++) {
        // running and creating the columns (x-axis)
        let id = `pos${x}-${y}`;
        // Defining a special id to each square
        let square = document.createElement('td');
        // Defining the cell
        square.id = id;
        // Assigning the id to the square
        square.classList.add('chess-square');
        square.setAttribute("onclick", "gameManager.selectSquare(this)")
        // Adding a class to the square (css)
        if ((x + y) % 2 === 0) {
          // formula which desides wheather the square should be white or black
          square.classList.add('white-square');
          // Adding a class to the square (css) *white-square*
        } else {
          square.classList.add('black-square');
          // Adding a class to the square (css) *black-square*
        }
        // creating a image placeholder for the pieces * can ignore for now*
        let piece = document.createElement('img');
        piece.classList.add('chess-piece');

        // Appending placeholder to square
        square.appendChild(piece);
        // Appending square to row
        row.appendChild(square);
      }
      // Appending row to table
      table.appendChild(row);
    }
    this.resetBoard();
  }

  resetBoard() {
    // Reseting board
    this.initializePieces();
  }

  initializePieces() {
    // Creating all the pieces
    this.wPieces = [];
    this.bPieces = [];
    this.board = new Array();

    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = SquareState.EMPTY;
      }
    }

    for (let i = 0; i < piecesPosition.length; i++) {
      this.createPiece(piecesPosition[i].type, TeamColor.BLACK, piecesPosition[i].pos);
      this.createPiece(piecesPosition[i].type, TeamColor.WHITE, mirrorPosVertically(piecesPosition[i].pos));
    }
  }

  createPiece(type, color, pos) {
    let piece;
    switch (type) {
      case Pawn.TYPE:
        piece = new Pawn(color, pos);
        break;
      case Rook.TYPE:
        piece = new Rook(color, pos);
        break;
      case Knight.TYPE:
        piece = new Knight(color, pos);
        break;
      case Bishop.TYPE:
        piece = new Bishop(color, pos);
        break;
      case Queen.TYPE:
        piece = new Queen(color, pos);
        break;
      case King.TYPE:
        piece = new King(color, pos);
        break;
    }
    this.board[pos.y][pos.x] = piece;
    (color === TeamColor.WHITE) ? this.wPieces.push(piece) : this.bPieces.push(piece);
    this.drawPiece(piece)
    return piece;
  }

  drawPiece(piece) {
    let imgPath = `./img/${piece.color}-${piece.type}.png`;
    let pieceImgElement = posToSqaure(piece.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  clearSquare(pos) {
    let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
    this.board[pos.y][pos.x] = SquareState.EMPTY;
    pieceImgElement.src = '';
  }

  captureSquare(pos) {
    let piece = this.board[pos.y][pos.x];
    if (piece) {
      piece.color === TeamColor.WHITE ? this.wPieces.splice(this.wPieces.indexOf(piece), 1) : this.bPieces.splice(this.bPieces.indexOf(piece), 1);
    }
    this.board[pos.y][pos.x] = SquareState.EMPTY;
  }

  clearBoard() {
    this.wPieces = [];
    this.bPieces = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        boardData.clearSquare({ x: j, y: i });
      }
    }
  }

  getPosState(pos, color) {
    if (pos.x > boardData.boardSize - 1 || pos.x < 0 || pos.y > boardData.boardSize - 1 || pos.y < 0) {
      return SquareState.OUT;
    }
    let square = boardData.board[pos.y][pos.x];
    return square !== SquareState.EMPTY ? square.color == color ? SquareState.FRIENDLY : SquareState.ENEMY : SquareState.EMPTY;
  }

  rollBack(wPieces, bPieces) {
    this.wPieces = [...wPieces];
    this.bPieces = [...bPieces];
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = SquareState.EMPTY;
      }
    }

    for (let piece of wPieces) {
      this.board[piece.pos.y][piece.pos.x] = piece;
      this.drawPiece(piece);
    }
    for (let piece of bPieces) {
      this.board[piece.pos.y][piece.pos.x] = piece;
      this.drawPiece(piece);
    }
  }
}
