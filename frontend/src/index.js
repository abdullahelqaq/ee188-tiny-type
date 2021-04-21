import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from "axios";

function Cell(props) {
  return (
    <button onClick={() => props.onClick()}>{props.value}</button>
  );
}

function MainGrid(props) {
  return (
    <div class="grid">
      <Cell
        value={'qwe'}
        onClick={() => props.handleClick(0)}
      />
      <Cell
        value={'rtyu'}
        onClick={() => props.handleClick(1)}
      />
      <Cell
        value={'iop'}
        onClick={() => props.handleClick(2)}
      />
      <Cell
        value={'asd'}
        onClick={() => props.handleClick(3)}
      />
      <Cell
        value={'fgh'}
        onClick={() => props.handleClick(4)}
      />
      <Cell
        value={'jkl'}
        onClick={() => props.handleClick(5)}
      />
      <Cell
        value={'zxc'}
        onClick={() => props.handleClick(6)}
      />
      <Cell
        value={'vb'}
        onClick={() => props.handleClick(7)}
      />
      <Cell
        value={'nm'}
        onClick={() => props.handleClick(8)}
      />
    </div>
  );
}

function renderCharCells(letters, eventListener) {
  var num_chars = 4;
  if (letters[2] === '0')
    num_chars = 2;
  else if (letters[3] === '0')
    num_chars = 3;

  var cells = [];
  for (let i = 0; i < num_chars; i++) {
    if (i === 3) {
      // push phantom button for spacing
      cells.push(
        <button id="phantom_button"></button>
      );
    }
    cells.push(
      <Cell
        value={letters[i]}
        onClick={() => eventListener(i)}
      />
    );
  }
  return cells;
}

function renderSuggestionCells(words, eventListener) {
  var num_suggestions = 0;
  console.log("words reached are:");
  console.log(words);
  if (words.length > 6)
    num_suggestions = 6
  else
    num_suggestions = words.length

  var cells = [];
  for (let i = 0; i < num_suggestions; i++) {
    cells.push(
      <Cell
        value={words[i]}
        onClick={() => eventListener(i)}
      />
    );
  }
  return cells;
}

function CharGroupGrid(props) {
  return (
    <div>
      <div class="grid">
        {renderCharCells(props.chars, props.handleClick)}
      </div>
      <p id="grid_header">Auto Suggestions:</p>
      <div class="grid">
        {renderSuggestionCells(props.words, props.handleWordClick)}
      </div>
    </div>

  );
}

class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
      letter_group: null,
      all_char_groups: ['qwe', 'rtyu', 'iop', 'asd', 'fgh', 'jkl', 'zxc', 'vb', 'nm'],
      suggestions: [],
    };
  }
  
  handleMainGridClick(i) {

    var words = this.state.word.split(" ");
    var current_word = words[words.length-1];

    axios.get("http://192.168.1.206:8081/" + current_word + "," + this.state.all_char_groups[i]).then(res => {
      console.log(res);
      if (res.data) {
        console.log(res.data)

        this.setState({
          word: this.state.word,
          letter_group: i,
          all_char_groups:  this.state.all_char_groups,
          suggestions: res.data,
        });

      } else {
        this.setState({
          word: this.state.word,
          letter_group: i,
          all_char_groups:  this.state.all_char_groups,
          suggestions: [],
        });
      }
    });
  }

  handleCharGridClick(i) {
    this.setState({
      word: this.state.word + this.state.all_char_groups[this.state.letter_group][i],
      letter_group: null,
      all_char_groups: this.state.all_char_groups,
      suggestions: this.state.suggestions,
    });
  }

  handleWordClick(i) {

    var iter = this.state.word.length - 1;
    var new_phrase = this.state.word;
    
    while (iter >= 0 && new_phrase[iter] !== " ") {
      new_phrase = new_phrase.substr(0, new_phrase.length - 1);
      iter -= 1;
    }

    new_phrase += this.state.suggestions[i] + " ";
    
    this.setState({
      word: new_phrase,
      letter_group: null,
      all_char_groups:  this.state.all_char_groups,
      suggestions: [],
    });
  }

  resetCharGroup() {
    this.setState({
      word: this.state.word,
      letter_group: null,
      all_char_groups:  this.state.all_char_groups,
      suggestions: this.state.suggestions,
    });
  }

  clearWord() {
    this.setState({
      word: '',
      letter_group: null,
      all_char_groups:  this.state.all_char_groups,
      suggestions: [],
    })
  }

  delChar() {
    this.setState({
      word: this.state.word.length > 0 ? this.state.word.slice(0, -1) : '',
      letter_group: null,
      all_char_groups:  this.state.all_char_groups,
      suggestions: [],
    });
  }

  addSpace() {
    this.setState({
      word: this.state.word + ' ',
      letter_group: null,
      all_char_groups:  this.state.all_char_groups,
      suggestions: [],
    });
  }

  renderCharGroup() {
    var letters = Array(4).fill('0');

    switch (this.state.letter_group) {
      case 1:
        letters[0] = this.state.all_char_groups[1][0];
        letters[1] = this.state.all_char_groups[1][1];
        letters[2] = this.state.all_char_groups[1][2];
        letters[3] = this.state.all_char_groups[1][3];
        break;
      case 7:
      case 8:
        letters[0] = this.state.all_char_groups[this.state.letter_group][0];
        letters[1] = this.state.all_char_groups[this.state.letter_group][1];
        break;
      default:
        letters[0] = this.state.all_char_groups[this.state.letter_group][0];
        letters[1] = this.state.all_char_groups[this.state.letter_group][1];
        letters[2] = this.state.all_char_groups[this.state.letter_group][2];
    }

    return (
      <CharGroupGrid chars={letters} words={this.state.suggestions} handleClick={this.handleCharGridClick.bind(this)} handleWordClick={this.handleWordClick.bind(this)}/>
    );
  }

  render() {
    if (this.state.letter_group != null) {
      return (
        <center>
            < br/><br />< br/>< br/>< br/><br />< br/>< br/>
            <div className="keyboard">
              <button
                id="top_button"
                onClick={() => this.resetCharGroup()}
              >
                &larr;
              </button>
              {this.renderCharGroup()}
            </div>
            <br /><p id="current_word">{this.state.word}</p>
        </center>
      );
    } else {
      return (
        <center>
            < br/><br />< br/>< br/>< br/><br />< br/>< br/>
            <div className="keyboard">
              <button
                id="top_buttons"
                onClick={() => this.clearWord()}
              >
                clear
              </button>
              <button
                id="top_buttons"
                onClick={() => this.delChar()}
              >
                del
              </button>
              <MainGrid handleClick={this.handleMainGridClick.bind(this)} />
              <button
                id="space_button"
                onClick={() => this.addSpace()}
              >
                space
              </button>
            </div>
            <br /><p id="current_word">{this.state.word}</p>
        </center>
      );
    }
  }
}

ReactDOM.render(
  <Keyboard />,
  document.getElementById('root')
);
