import React from 'react';
import './style.css';

const images = require.context('./assets/images', false, /\.(png|jpg)$/);
const sounds = require.context('./assets/sounds', false, /\.(mp3|ico)$/);

class FumoVote extends React.Component {
  constructor(props) {
    super(props);
    const savedVotes = localStorage.getItem('votes');
    this.state = savedVotes
      ? JSON.parse(savedVotes)
      : {
          votes: {
            Reimu: 0,
            Marisa: 0,
            Reisen: 0,
            Cirno: 0,
          },
          winner: null,
        };
  }

  saveVotesLocal = () => {
    localStorage.setItem('votes', JSON.stringify(this.state));
  };

  voteClick = (candidate) => {
    const oldVotes = this.state.votes;

    const newVotes = {
      Reimu: oldVotes.Reimu,
      Marisa: oldVotes.Marisa,
      Reisen: oldVotes.Reisen,
      Cirno: oldVotes.Cirno,
    };

    newVotes[candidate] += 1;

    this.setState({ votes: newVotes }, this.saveVotesLocal);
  };

  displayWinner = () => {
    const votesResult = this.state.votes;
    let maxVotes = -Infinity;
    let winner = '';
    for (const candidate in votesResult) {
      if (votesResult[candidate] > maxVotes) {
        maxVotes = votesResult[candidate];
        winner = candidate;
      }
    }
    if (maxVotes > 0) {
      this.setState({ winner: winner }, () => {
        const winnerSound = sounds(`./${winner}.mp3`);
        this.playSound(winnerSound);
      });
    }
    this.saveVotesLocal();
  };

  clearScore = () => {
    const clearedVotes = {};
    const currentVotes = this.state.votes;
    for (const candidate in currentVotes) {
      clearedVotes[candidate] = 0;
    }
    this.setState({ votes: clearedVotes, winner: null }, this.saveVotesLocal);
  };

  playSound = (candidate) => {
    const audio = new Audio(candidate);
    audio.play();
  };

  componentDidMount() {
    this.displayWinner();
  }

  render() {
    return (
      <div className="margin-top-50px">
        <div className="vote-card-display-zone">
          {Object.keys(this.state.votes).map((candidate) => {
            const img = images(`./${candidate}.jpg`);
            const sound = sounds(`./${candidate}.mp3`);
            return (
              <div
                className="candidate-card"
                key={candidate}
                onClick={() => {
                  this.voteClick(candidate);
                  this.playSound(sound);
                }}
              >
                <img src={img} draggable="false" alt={candidate} />
                <div className="candidate-info">
                  <h3>{candidate}</h3>
                  <span>Votes: {this.state.votes[candidate]}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bottom-section">
          <button
            onClick={() => {
              this.displayWinner();
            }}
          >
            Get winner
          </button>
          <button onClick={this.clearScore}>Reset score</button>
          <span>Winner is: {this.state.winner || ''}</span>
        </div>
      </div>
    );
  }
}

export default FumoVote;
