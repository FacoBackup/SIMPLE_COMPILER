(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/lexical/Token.ts
  var Token = class {
    _type;
    /**
     * Represents address on
     * @private
     */
    _symbolAddress;
    _line;
    _column;
    constructor(type, symbolAddress, line, column) {
      this._type = type;
      this._line = line;
      this._column = column;
      this._symbolAddress = symbolAddress;
    }
    get type() {
      return this._type;
    }
    set type(value) {
      this._type = value;
    }
    get symbolAddress() {
      return this._symbolAddress;
    }
    set symbolAddress(value) {
      this._symbolAddress = value;
    }
    get line() {
      return this._line;
    }
    set line(value) {
      this._line = value;
    }
    get column() {
      return this._column;
    }
    set column(value) {
      this._column = value;
    }
    #minTwoDigits(n) {
      return (n < 10 ? "0" : "") + n;
    }
    toString() {
      return `[${this.#minTwoDigits(this.type)}, ${this.symbolAddress > -1 ? this.#minTwoDigits(this.symbolAddress) : "  "}, (${this.#minTwoDigits(this.line)}, ${this.#minTwoDigits(this.column)})]`;
    }
  };

  // src/lexical/Lexeme.ts
  var Lexeme = class {
    _term;
    _type;
    _line;
    _column;
    constructor(character, type, line, column) {
      this._term = character;
      this._type = type;
      this._line = line;
      this._column = column;
    }
    append(char, type) {
      this._term += char;
      this._type = type;
    }
    get type() {
      return this._type;
    }
    get line() {
      return this._line;
    }
    get term() {
      return this._term;
    }
    toString() {
      return "'" + this._term + "' (" + this._line + ", " + this._column + ")";
    }
    toToken(symbolAddress) {
      if (symbolAddress != null) {
        return new Token(this._type, symbolAddress, this._line, this._column);
      }
      return new Token(this._type, -1, this._line, this._column);
    }
  };

  // src/lexical/TokenType.ts
  var TokenType = /* @__PURE__ */ ((TokenType2) => {
    TokenType2[TokenType2["END_OF_LINE"] = 10] = "END_OF_LINE";
    TokenType2[TokenType2["END_OF_INPUT"] = 3] = "END_OF_INPUT";
    TokenType2[TokenType2["ASSIGNMENT"] = 11] = "ASSIGNMENT";
    TokenType2[TokenType2["ADD"] = 21] = "ADD";
    TokenType2[TokenType2["SUBTRACT"] = 22] = "SUBTRACT";
    TokenType2[TokenType2["MULTIPLY"] = 23] = "MULTIPLY";
    TokenType2[TokenType2["DIVIDE"] = 24] = "DIVIDE";
    TokenType2[TokenType2["MODULO"] = 25] = "MODULO";
    TokenType2[TokenType2["EQ"] = 31] = "EQ";
    TokenType2[TokenType2["NE"] = 32] = "NE";
    TokenType2[TokenType2["GT"] = 33] = "GT";
    TokenType2[TokenType2["LT"] = 34] = "LT";
    TokenType2[TokenType2["GE"] = 35] = "GE";
    TokenType2[TokenType2["LE"] = 36] = "LE";
    TokenType2[TokenType2["VARIABLE"] = 41] = "VARIABLE";
    TokenType2[TokenType2["INTEGER"] = 51] = "INTEGER";
    TokenType2[TokenType2["REM"] = 61] = "REM";
    TokenType2[TokenType2["INPUT"] = 62] = "INPUT";
    TokenType2[TokenType2["LET"] = 63] = "LET";
    TokenType2[TokenType2["PRINT"] = 64] = "PRINT";
    TokenType2[TokenType2["GOTO"] = 65] = "GOTO";
    TokenType2[TokenType2["IF"] = 66] = "IF";
    TokenType2[TokenType2["END"] = 67] = "END";
    TokenType2[TokenType2["ERROR"] = 99] = "ERROR";
    return TokenType2;
  })(TokenType || {});
  var TokenType_default = TokenType;

  // src/lexical/LexicalError.ts
  var LexicalError = class extends Error {
    column;
    line;
    message;
    constructor(message, line, column) {
      super(`LINE: ${line};
COLUMN: ${column}`);
      this.line = line;
      this.column = column;
      this.message = message;
    }
  };

  // src/lexical/LexicalAnalyzer.ts
  var LexicalAnalyzer = class {
    error = false;
    source;
    /**
     * Key represents variable or integer and value the declaration index on the code
     */
    symbolTable = /* @__PURE__ */ new Map();
    tokens;
    lexeme;
    column = 0;
    line = 1;
    charGenerator;
    exceptions = [];
    constructor(source) {
      this.source = source;
      this.tokens = [];
      this.symbolTable.clear();
      this.error = false;
      this.charGenerator = this.next();
    }
    addSymbolTable(lexeme) {
      if (!this.symbolTable.has(lexeme)) {
        this.symbolTable.set(lexeme, this.symbolTable.size);
      }
      return this.symbolTable.get(lexeme);
    }
    addToken() {
      if (this.lexeme.type != TokenType_default.ERROR) {
        if (this.lexeme.type === TokenType_default.INTEGER || this.lexeme.type === TokenType_default.VARIABLE) {
          this.tokens.push(this.lexeme.toToken(this.addSymbolTable(this.lexeme.term)));
        } else {
          this.tokens.push(this.lexeme.toToken());
        }
      } else {
        this.exceptions.push(new LexicalError(this.lexeme.toString(), this.line, this.column));
        this.error = true;
      }
    }
    *next() {
      const split = this.source.split("").reverse();
      while (split.length > 0) {
        let char = split.pop();
        if (char === "\r") {
          char = split.pop();
        }
        this.column++;
        yield char;
      }
      this.source = null;
      yield 0;
    }
    analyze() {
      while (this.source != null) {
        this.q0();
      }
      return this.exceptions;
    }
    q0() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.q04();
          break;
        case "\n":
          this.q03();
          break;
        case " ":
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        case "+":
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        default:
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q99();
      }
    }
    /**
     * Estado responsavel pelo reconhecimento da constante numerica inteira
     */
    q01() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.lexeme.append(character, TokenType_default.INTEGER);
          this.q01();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q01();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do identificador
     */
    q02() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q02();
      }
    }
    /**
     * Estado responsavel pelo reconhecimento do delimitador de nova linha
     */
    q03() {
      this.lexeme = new Lexeme("\n", TokenType_default.END_OF_LINE, this.line, this.column);
      this.addToken();
      this.line++;
      this.column = 0;
    }
    /**
     * Estado responsavel pelo reconhecimento do delimitador de fim de texto
     */
    q04() {
      this.lexeme = new Lexeme("\0", TokenType_default.END_OF_INPUT, this.line, this.column);
      this.addToken();
    }
    /**
     * Estado responsavel pelo reconhecido dos operadores aritmeticos
     * adicao (+)
     * subtracao (-)
     * multiplicacao (*)
     * divisao inteira (/)
     * resto da divisao inteira (%)
     */
    q05() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q05();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador de atribuicao (=)
     */
    q06() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        case "=":
          this.lexeme.append(character, TokenType_default.EQ);
          this.q09();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q06();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * menor que (<)
     */
    q07() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        case "=":
          this.lexeme.append(character, TokenType_default.LE);
          this.q10();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q07();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * maior que (>)
     */
    q08() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        case "=":
          this.lexeme.append(character, TokenType_default.GE);
          this.q11();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q08();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * igual a (==)
     */
    q09() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q09();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * maior ou igual a (>=)
     */
    q10() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q10();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * menor ou igual a (<=)
     */
    q11() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q11();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * diferente de (!=)
     */
    q12() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q12();
      }
    }
    /**
     * Estado responsavel pelo reconhecido do operador relacional
     * diferente de (!=)
     */
    q13() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "=":
          this.lexeme.append(character, TokenType_default.NE);
          this.q12();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q13();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada rem
     */
    q14() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "e":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q15();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q14();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada rem
     */
    q15() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "m":
          this.lexeme.append(character, TokenType_default.REM);
          this.q31();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q15();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada if
     */
    q16() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "f":
          this.lexeme.append(character, TokenType_default.IF);
          this.q32();
          break;
        case "n":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q17();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q16();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada input
     */
    q17() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "p":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q18();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q17();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada input
     */
    q18() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "u":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q19();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q18();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada input
     */
    q19() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "t":
          this.lexeme.append(character, TokenType_default.INPUT);
          this.q32();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q19();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada let
     */
    q20() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "e":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q21();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q20();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada let
     */
    q21() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "t":
          this.lexeme.append(character, TokenType_default.LET);
          this.q32();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q21();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada print
     */
    q22() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "r":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q23();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q22();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada print
     */
    q23() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "i":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q24();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q23();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada print
     */
    q24() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "n":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q25();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q24();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada print
     */
    q25() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "t":
          this.lexeme.append(character, TokenType_default.PRINT);
          this.q32();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q25();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada goto
     */
    q26() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "o":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q27();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q26();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada goto
     */
    q27() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "t":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q28();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q27();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada goto
     */
    q28() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "o":
          this.lexeme.append(character, TokenType_default.GOTO);
          this.q32();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q28();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada end
     */
    q29() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        case "n":
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q30();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q29();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada end
     */
    q30() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        case "d":
          this.lexeme.append(character, TokenType_default.END);
          this.q32();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q30();
      }
    }
    /**
     * Estado responsavel pelo reconhecido da palavra reservada rem
     */
    q31() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        default:
          this.q31();
      }
    }
    /**
     * Estado responsavel pelo reconhecido das palavras reservadas
     * end
     * goto
     * if
     * input
     * let
     * print
     */
    q32() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.addToken();
          this.q04();
          break;
        case "\n":
          this.addToken();
          this.q03();
          break;
        case " ":
          this.addToken();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q32();
      }
    }
    /**
     * Estado responsavel pelo reconhecimento do erro
     */
    q99() {
      const character = this.charGenerator.next().value;
      switch (character) {
        case 0:
          this.q04();
          break;
        case "\n":
          this.q03();
          break;
        case " ":
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.INTEGER, this.line, this.column);
          this.q01();
          break;
        case "a":
        case "b":
        case "c":
        case "d":
        case "f":
        case "h":
        case "j":
        case "k":
        case "m":
        case "n":
        case "o":
        case "q":
        case "s":
        case "t":
        case "u":
        case "v":
        case "w":
        case "x":
        case "y":
        case "z":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q02();
          break;
        case "r":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q14();
          break;
        case "i":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q16();
          break;
        case "l":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q20();
          break;
        case "p":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q22();
          break;
        case "g":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q26();
          break;
        case "e":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.VARIABLE, this.line, this.column);
          this.q29();
          break;
        case "+":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ADD, this.line, this.column);
          this.q05();
          break;
        case "-":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.SUBTRACT, this.line, this.column);
          this.q05();
          break;
        case "*":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MULTIPLY, this.line, this.column);
          this.q05();
          break;
        case "/":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.DIVIDE, this.line, this.column);
          this.q05();
          break;
        case "%":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.MODULO, this.line, this.column);
          this.q05();
          break;
        case "=":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ASSIGNMENT, this.line, this.column);
          this.q06();
          break;
        case "<":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.LT, this.line, this.column);
          this.q07();
          break;
        case ">":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.GT, this.line, this.column);
          this.q08();
          break;
        case "!":
          this.addToken();
          this.lexeme = new Lexeme(character, TokenType_default.ERROR, this.line, this.column);
          this.q13();
          break;
        default:
          this.lexeme.append(character, TokenType_default.ERROR);
          this.q99();
      }
    }
  };

  // src/syntax/SyntaxSymbol.ts
  var SyntaxSymbol = /* @__PURE__ */ ((SyntaxSymbol2) => {
    SyntaxSymbol2[SyntaxSymbol2["LET"] = 0] = "LET";
    SyntaxSymbol2[SyntaxSymbol2["INTEGER"] = 1] = "INTEGER";
    SyntaxSymbol2[SyntaxSymbol2["END_OF_LINE"] = 2] = "END_OF_LINE";
    SyntaxSymbol2[SyntaxSymbol2["END_OF_INPUT"] = 3] = "END_OF_INPUT";
    SyntaxSymbol2[SyntaxSymbol2["ASSIGNMENT"] = 4] = "ASSIGNMENT";
    SyntaxSymbol2[SyntaxSymbol2["ADD"] = 5] = "ADD";
    SyntaxSymbol2[SyntaxSymbol2["SUBTRACT"] = 6] = "SUBTRACT";
    SyntaxSymbol2[SyntaxSymbol2["MULTIPLY"] = 7] = "MULTIPLY";
    SyntaxSymbol2[SyntaxSymbol2["DIVIDE"] = 8] = "DIVIDE";
    SyntaxSymbol2[SyntaxSymbol2["MODULO"] = 9] = "MODULO";
    SyntaxSymbol2[SyntaxSymbol2["EQ"] = 10] = "EQ";
    SyntaxSymbol2[SyntaxSymbol2["NE"] = 11] = "NE";
    SyntaxSymbol2[SyntaxSymbol2["GT"] = 12] = "GT";
    SyntaxSymbol2[SyntaxSymbol2["LT"] = 13] = "LT";
    SyntaxSymbol2[SyntaxSymbol2["GE"] = 14] = "GE";
    SyntaxSymbol2[SyntaxSymbol2["LE"] = 15] = "LE";
    SyntaxSymbol2[SyntaxSymbol2["VARIABLE"] = 16] = "VARIABLE";
    SyntaxSymbol2[SyntaxSymbol2["REM"] = 17] = "REM";
    SyntaxSymbol2[SyntaxSymbol2["INPUT"] = 18] = "INPUT";
    SyntaxSymbol2[SyntaxSymbol2["PRINT"] = 19] = "PRINT";
    SyntaxSymbol2[SyntaxSymbol2["GOTO"] = 20] = "GOTO";
    SyntaxSymbol2[SyntaxSymbol2["IF"] = 21] = "IF";
    SyntaxSymbol2[SyntaxSymbol2["END"] = 22] = "END";
    return SyntaxSymbol2;
  })(SyntaxSymbol || {});
  var SyntaxSymbol_default = SyntaxSymbol;

  // src/syntax/SyntaxInput.ts
  var SyntaxInput = class {
    _token;
    constructor(token) {
      this._token = token;
    }
    getSymbol() {
      if (!this._token)
        return null;
      const tokenType = this._token.type;
      switch (tokenType) {
        case TokenType_default.LET:
          return SyntaxSymbol_default.LET;
        case TokenType_default.VARIABLE:
          return SyntaxSymbol_default.VARIABLE;
        case TokenType_default.INTEGER:
          return SyntaxSymbol_default.INTEGER;
        case TokenType_default.INPUT:
          return SyntaxSymbol_default.INPUT;
        case TokenType_default.PRINT:
          return SyntaxSymbol_default.PRINT;
        case TokenType_default.ERROR:
          return null;
        case TokenType_default.END_OF_LINE:
          return SyntaxSymbol_default.END_OF_LINE;
        case TokenType_default.END_OF_INPUT:
          return SyntaxSymbol_default.END_OF_INPUT;
        case TokenType_default.ASSIGNMENT:
          return SyntaxSymbol_default.ASSIGNMENT;
        case TokenType_default.ADD:
          return SyntaxSymbol_default.ADD;
        case TokenType_default.SUBTRACT:
          return SyntaxSymbol_default.SUBTRACT;
        case TokenType_default.MULTIPLY:
          return SyntaxSymbol_default.MULTIPLY;
        case TokenType_default.DIVIDE:
          return SyntaxSymbol_default.DIVIDE;
        case TokenType_default.MODULO:
          return SyntaxSymbol_default.MODULO;
        case TokenType_default.EQ:
          return SyntaxSymbol_default.EQ;
        case TokenType_default.NE:
          return SyntaxSymbol_default.NE;
        case TokenType_default.GT:
          return SyntaxSymbol_default.GT;
        case TokenType_default.LT:
          return SyntaxSymbol_default.LT;
        case TokenType_default.GE:
          return SyntaxSymbol_default.GE;
        case TokenType_default.LE:
          return SyntaxSymbol_default.LE;
        case TokenType_default.REM:
          return SyntaxSymbol_default.REM;
        case TokenType_default.GOTO:
          return SyntaxSymbol_default.GOTO;
        case TokenType_default.IF:
          return SyntaxSymbol_default.IF;
        case TokenType_default.END:
          return SyntaxSymbol_default.END;
      }
      return null;
    }
    get token() {
      return this._token;
    }
  };

  // src/syntax/SyntaxError.ts
  var SyntaxError = class extends Error {
    line;
    column;
    message;
    static UNEXPECTED_EOL = "Unexpected end of line";
    static EXPECTED_END = "Expected 'end' keyword but found EOF";
    static EXPECTED_INTEGER = "Expected integer but found otherwise";
    static EXPECTED_ASSIGNABLE = "Expected assignable but found otherwise";
    static UNEXPECTED_ERROR = "Unexpected error";
    static EXPECTED_EXPRESSION = "Expected expression but found otherwise";
    static EXPECTED_VARIABLE_DECLARATION = "Expected variable declaration but found otherwise";
    static MISSING_LINE_ENUMERATION = "Missing line enumeration";
    static UNEXPECTED_COMMAND_BEFORE_COMMAND = "Unexpected command before command";
    constructor(message, line, column) {
      super(` Syntactic analysis error: 
- LINE: ${line}
- COLUMN: ${column}
- MESSAGE: ${message}`);
      this.line = line;
      this.column = column;
      this.message = message;
    }
  };

  // src/AbstractAnalyzer.ts
  var AbstractAnalyzer = class {
    tokens;
    currentToken;
    lineTokens;
    hasReachedEnd = false;
    missingLineTokens;
    exceptions = [];
    originalTokens = [];
    isOnIf;
    stack = [];
    shift() {
      const first = this.tokens[0];
      this.tokens.splice(0, 1);
      this.currentToken = first;
      return first;
    }
    extractLineTokens() {
      this.originalTokens = [...this.tokens];
      const lineTokens = [];
      let isEndOfLine = false;
      let missingLineTokens = [];
      this.tokens.forEach((token, index) => {
        if (token.type === TokenType_default.END_OF_LINE) {
          isEndOfLine = true;
          return;
        }
        if ((isEndOfLine || index === 0) && token.type === TokenType_default.INTEGER) {
          lineTokens.push(token);
          isEndOfLine = false;
        } else if ((isEndOfLine || index === 0) && token.type !== TokenType_default.INTEGER && token.type !== TokenType_default.REM) {
          missingLineTokens.push(token.line);
          isEndOfLine = false;
        }
      });
      this.missingLineTokens = missingLineTokens;
      this.tokens = this.tokens.filter((t) => !lineTokens.includes(t));
      this.lineTokens = lineTokens;
    }
    throwError(message, line = this.currentToken.line, column = this.currentToken.column) {
      this.exceptions.push(this.createError(message, line, column));
      this.skipLine();
    }
    skipLine() {
      let currentToken = this.currentToken;
      while (currentToken != null && currentToken.type !== TokenType_default.END_OF_LINE) {
        currentToken = this.shift();
      }
      this.isOnIf = false;
      this.stack.length = 0;
    }
  };

  // src/syntax/SyntaxAnalyzer.ts
  var SyntaxAnalyzer = class _SyntaxAnalyzer extends AbstractAnalyzer {
    static ASSIGNABLE = [TokenType_default.VARIABLE, TokenType_default.INTEGER];
    static EXCLUSIVE_LINE_REQUIRED = [SyntaxSymbol_default.END, SyntaxSymbol_default.IF, SyntaxSymbol_default.LET];
    static REQUIRES_INTEGER_OR_VARIABLE = [SyntaxSymbol_default.ADD, SyntaxSymbol_default.SUBTRACT, SyntaxSymbol_default.MULTIPLY, SyntaxSymbol_default.DIVIDE, SyntaxSymbol_default.MODULO, SyntaxSymbol_default.EQ, SyntaxSymbol_default.NE, SyntaxSymbol_default.GT, SyntaxSymbol_default.LT, SyntaxSymbol_default.GE, SyntaxSymbol_default.LE];
    static FUNCTIONS = [SyntaxSymbol_default.GOTO, SyntaxSymbol_default.PRINT, SyntaxSymbol_default.LET, SyntaxSymbol_default.END_OF_LINE];
    static SIGNS = [TokenType_default.ADD, TokenType_default.SUBTRACT];
    constructor(tokens) {
      super();
      this.tokens = [...tokens];
    }
    analyze() {
      this.extractLineTokens();
      this.missingLineTokens.forEach((line) => {
        this.throwError(SyntaxError.MISSING_LINE_ENUMERATION, line, 0);
      });
      while (this.tokens.length > 0) {
        const current = this.shift();
        const next = new SyntaxInput(this.tokens[0]);
        const currentInput = new SyntaxInput(current);
        const symbol = currentInput.getSymbol();
        if (current.type == TokenType_default.END_OF_INPUT && this.hasReachedEnd) {
          return this.exceptions;
        }
        this.checkForInconclusiveOperator(next);
        this.throwIfSymbolIsInvalid(symbol);
        this.throwIfStackIsNotEmpty(symbol);
        this.throwIfStackIsEmpty(symbol);
        this.throwIfMissingExpression(symbol);
        switch (symbol) {
          case SyntaxSymbol_default.END_OF_LINE:
            this.handleEndOfLine();
            break;
          case SyntaxSymbol_default.ASSIGNMENT:
            this.handleAssignment(next);
            break;
          case SyntaxSymbol_default.ADD:
          case SyntaxSymbol_default.SUBTRACT:
            this.handleSigns(next);
            break;
          case SyntaxSymbol_default.MULTIPLY:
          case SyntaxSymbol_default.DIVIDE:
          case SyntaxSymbol_default.MODULO:
          case SyntaxSymbol_default.EQ:
          case SyntaxSymbol_default.NE:
          case SyntaxSymbol_default.GT:
          case SyntaxSymbol_default.LT:
          case SyntaxSymbol_default.GE:
          case SyntaxSymbol_default.LE:
            this.handleOperation(next);
            break;
          case SyntaxSymbol_default.PRINT:
            this.handlePrint(next);
            break;
          case SyntaxSymbol_default.INPUT:
            this.handlePrint(next);
            break;
          case SyntaxSymbol_default.IF:
            this.stack.push(current);
            this.isOnIf = true;
            break;
          case SyntaxSymbol_default.VARIABLE:
          case SyntaxSymbol_default.LET:
          case SyntaxSymbol_default.INTEGER:
            this.stack.push(current);
            break;
          case SyntaxSymbol_default.GOTO:
            this.handleGOTO(next);
            break;
          case SyntaxSymbol_default.REM:
            this.handleComment();
            break;
          case SyntaxSymbol_default.END:
            this.handleEnd();
            break;
        }
      }
      if (!this.hasReachedEnd) {
        this.throwError(SyntaxError.EXPECTED_END);
      }
      return this.exceptions;
    }
    /**
     *                     |
     *                     V
     * EXAMPLE: let a = 10 + REM COMMENT HERE
     * @param symbol
     */
    throwIfStackIsNotEmpty(symbol) {
      if (_SyntaxAnalyzer.EXCLUSIVE_LINE_REQUIRED.includes(symbol) && this.stack.length > 0) {
        this.throwError(SyntaxError.UNEXPECTED_COMMAND_BEFORE_COMMAND);
      }
    }
    checkForInconclusiveOperator(next) {
      switch (next.getSymbol()) {
        case SyntaxSymbol_default.ADD:
        case SyntaxSymbol_default.SUBTRACT:
        case SyntaxSymbol_default.MULTIPLY:
        case SyntaxSymbol_default.DIVIDE:
        case SyntaxSymbol_default.MODULO:
        case SyntaxSymbol_default.EQ:
        case SyntaxSymbol_default.NE:
        case SyntaxSymbol_default.GT:
        case SyntaxSymbol_default.LT:
        case SyntaxSymbol_default.GE:
        case SyntaxSymbol_default.LE:
          this.stack.push(this.currentToken, next.token);
          break;
      }
    }
    createError(message, line, column) {
      return new SyntaxError(message, line, column);
    }
    handleEnd() {
      if (this.tokens[0] == null && this.tokens[0].type !== TokenType_default.END_OF_INPUT || this.stack.length > 0) {
        this.throwError(SyntaxError.UNEXPECTED_EOL);
      }
      this.hasReachedEnd = true;
    }
    handleComment() {
      this.skipLine();
    }
    handleGOTO(next) {
      if (next.getSymbol() !== SyntaxSymbol_default.INTEGER) {
        this.throwError(SyntaxError.EXPECTED_INTEGER);
      }
    }
    handleEndOfLine() {
      if (this.stack.length > 0 && !_SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type)) {
        this.throwError(SyntaxError.EXPECTED_ASSIGNABLE);
      }
      if (this.isOnIf && this.stack.length === 0) {
        this.throwError(SyntaxError.EXPECTED_EXPRESSION);
      }
      this.isOnIf = false;
      this.stack.length = 0;
    }
    handleAssignment(next) {
      let includesVariable = false;
      let includesLet = false;
      this.stack.forEach((t) => {
        if (t.type === TokenType_default.VARIABLE)
          includesVariable = true;
        if (t.type === TokenType_default.LET)
          includesLet = true;
      });
      if (!includesLet || !includesVariable || !_SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type) && !_SyntaxAnalyzer.SIGNS.includes(next.token.type)) {
        this.throwError(SyntaxError.EXPECTED_VARIABLE_DECLARATION);
      }
      this.stack.length = 0;
      this.stack.push(this.currentToken);
    }
    throwIfStackIsEmpty(symbol) {
      if (_SyntaxAnalyzer.REQUIRES_INTEGER_OR_VARIABLE.includes(symbol) && this.stack.length === 0) {
        this.throwError(SyntaxError.EXPECTED_ASSIGNABLE);
      }
    }
    /**
     * TokenType error
     * @param symbol
     * @private
     */
    throwIfSymbolIsInvalid(symbol) {
      if (symbol == null) {
        this.throwError(SyntaxError.UNEXPECTED_ERROR);
      }
    }
    handleOperation(next) {
      if (!_SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type) || !_SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type)) {
        this.throwError(SyntaxError.EXPECTED_ASSIGNABLE);
      }
    }
    handlePrint(next) {
      if (next.getSymbol() !== SyntaxSymbol_default.VARIABLE) {
        this.throwError(SyntaxError.EXPECTED_ASSIGNABLE);
      }
    }
    handleSigns(next) {
      if (!_SyntaxAnalyzer.ASSIGNABLE.includes(next.token.type)) {
        this.throwError(SyntaxError.EXPECTED_ASSIGNABLE);
      }
      const isStackEmpty = this.stack.length === 0;
      const previousTokenIsNotVariable = !_SyntaxAnalyzer.ASSIGNABLE.includes(this.stack[this.stack.length - 1].type);
      const previousTokenIsNotAssigment = this.stack[this.stack.length - 1].type !== TokenType_default.ASSIGNMENT;
      if (isStackEmpty || previousTokenIsNotAssigment && previousTokenIsNotVariable) {
        this.throwError(SyntaxError.UNEXPECTED_ERROR);
      }
    }
    throwIfMissingExpression(symbol) {
      const lastNodeIsIf = this.stack.length === 0 || this.stack.length > 0 && this.stack[this.stack.length - 1].type === TokenType_default.IF;
      const isFunctionNode = _SyntaxAnalyzer.FUNCTIONS.includes(symbol);
      if (this.isOnIf && lastNodeIsIf && isFunctionNode) {
        this.throwError(SyntaxError.EXPECTED_EXPRESSION);
      }
    }
  };

  // src/semantic/SemanticError.ts
  var SemanticError = class extends Error {
    line;
    column;
    message;
    static GOTO_LINE_NOT_FOUND = "GOTO command line not found";
    static VARIABLE_DECLARATION_NOT_FOUND = "Variable declaration not found";
    constructor(message, line, column) {
      super(` Semantic analysis error: 
- LINE: ${line}
- COLUMN: ${column}
- MESSAGE: ${message}`);
      this.line = line;
      this.column = column;
      this.message = message;
    }
  };

  // src/semantic/SemanticAnalyzer.ts
  var SemanticAnalyzer = class extends AbstractAnalyzer {
    reversedSymbolMap = /* @__PURE__ */ new Map();
    symbolMap;
    declared = /* @__PURE__ */ new Map();
    constructor(tokens, symbolMap) {
      super();
      this.tokens = tokens;
      this.symbolMap = symbolMap;
      Array.from(symbolMap.entries()).forEach((entry) => {
        this.reversedSymbolMap.set(entry[1], entry[0]);
      });
    }
    analyze() {
      this.extractLineTokens();
      while (this.tokens.length > 0) {
        const current = this.shift();
        const next = new SyntaxInput(this.tokens[0]);
        const currentInput = new SyntaxInput(current);
        const symbol = currentInput.getSymbol();
        if (current.type == TokenType_default.END_OF_INPUT && this.hasReachedEnd) {
          return this.exceptions;
        }
        switch (symbol) {
          case SyntaxSymbol_default.GOTO:
            this.handleGOTO(next);
            break;
          case SyntaxSymbol_default.VARIABLE:
            this.handleVariable(next);
            break;
          case SyntaxSymbol_default.LET:
            this.stack.push(current);
            break;
          case SyntaxSymbol_default.END_OF_LINE:
            this.stack.length = 0;
            break;
        }
      }
      return this.exceptions;
    }
    handleVariable(next) {
      if (this.stack[0]?.type === TokenType_default.LET) {
        this.declared.set(this.currentToken.symbolAddress, this.currentToken.line);
        this.stack.length = 0;
        return;
      }
      const noVariableDeclarationFound = this.declared.get(this.currentToken.symbolAddress) == null;
      const isDeclarationOnSameLine = this.declared.get(this.currentToken.symbolAddress) === this.currentToken.line;
      if (noVariableDeclarationFound || isDeclarationOnSameLine) {
        this.throwError(SemanticError.VARIABLE_DECLARATION_NOT_FOUND);
      }
    }
    handleGOTO(next) {
      const nextTokenAddress = next.token.symbolAddress;
      const targetLine = this.reversedSymbolMap.get(nextTokenAddress);
      const lineFound = this.lineTokens.find((token) => {
        const tokenAddress = token.symbolAddress;
        return this.reversedSymbolMap.get(tokenAddress) === targetLine;
      });
      if (lineFound == null) {
        this.throwError(SemanticError.GOTO_LINE_NOT_FOUND);
      }
    }
    createError(message, line, column) {
      return new SemanticError(message, line, column);
    }
  };

  // src/Compiler.ts
  var Compiler = class {
    static compile(sc) {
      const code = sc.split("\n").filter((l) => l.replace(/(\s+)/g, "").length !== 0).join("\n");
      const lexicalInstance = new LexicalAnalyzer(code);
      const lexicalErrors = lexicalInstance.analyze();
      let syntaxErrors = [], semanticErrors = [];
      if (lexicalErrors.length === 0) {
        const syntacticInstance = new SyntaxAnalyzer(lexicalInstance.tokens);
        syntaxErrors = syntacticInstance.analyze();
        if (syntaxErrors.length === 0) {
          const semanticInstance = new SemanticAnalyzer(lexicalInstance.tokens, lexicalInstance.symbolTable);
          semanticErrors = semanticInstance.analyze();
        }
      }
      return {
        lexicalErrors,
        syntaxErrors,
        semanticErrors
      };
    }
  };

  // src/index.ts
  var fs = __toESM(__require("fs"));
  var path = __toESM(__require("path"));
  async function main() {
    const FILE_NAME = process.argv[2];
    const sourceCode = (await fs.promises.readFile(path.resolve(__dirname + path.sep + FILE_NAME))).toString();
    const errors = Compiler.compile(sourceCode, true);
    const splitSource = sourceCode.split("\n");
    if (errors instanceof SyntaxError) {
      console.log(`
        MESSAGE:\x1B[31m ${errors.message} \x1B[0m
        LINE:\x1B[31m ${errors.line} \x1B[0m
        COLUMN:\x1B[31m ${errors.column} \x1B[0m
        LINE WITH ERROR ----> \x1B[31m ${splitSource[errors.line - 1]} \x1B[0m
        `.replace(/^(\s+)/gm, ""));
    } else
      console.log("\x1B[32mThe source-code provided is valid \x1B[0m");
  }
  main().catch(console.error);
})();
