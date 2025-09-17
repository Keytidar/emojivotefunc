import React, { useEffect, useState } from 'react';
import './style.css';

const images = require.context('./assets/images', false, /\.(png|jpg)$/);
const sounds = require.context('./assets/sounds', false, /\.(mp3|ico)$/);

const FumoVote = (props) => {
  const localSavedVotes = localStorage.getItem('votes');
  const [votes, setVotes] = useState(
    localSavedVotes
      ? JSON.parse(localSavedVotes)
      : {
          votes: {
            Reimu: 0,
            Marisa: 0,
            Reisen: 0,
            Cirno: 0,
          },
          winner: null,
        }
  );

  const saveVotesLocal = () => {
    localStorage.setItem('votes', JSON.stringify(votes));
  };

  useEffect(() => {
    saveVotesLocal();
  }, [votes]);


  const voteClick = (candidate) => {
    setVotes((prev) => ({
      ...prev, votes: {...prev.votes, [candidate]: prev.votes[candidate] + 1 }
    }))
  };

  const clearVotes = () => {
    setVotes(() => ({
       votes: {
        Reimu: 0,
        Marisa: 0,
        Reisen: 0,
        Cirno: 0,
       },
       winner: null,
    }))
  }

  const playAudio = (candidate) => {
    const audio = new Audio(candidate);
    audio.play();
  }

  const displayWinner = (candidate) => {
    const votesResult = votes.votes;
    let maxVotes = -Infinity;
    let winner = '';
    for (const candidate in votesResult) {
      if (votesResult[candidate] > maxVotes) {
        maxVotes = votesResult[candidate];
        winner = candidate;
      }
    }
    if (maxVotes > 0) {
      setVotes((prev) => ({
        ...prev, winner: winner,
      }))
    }
  }

  return (
    <div className="margin-top-50px">
      <div className="vote-card-display-zone">
        {Object.keys(votes.votes).map((candidate) => {
          const img = images(`./${candidate}.jpg`);
          const sound = sounds(`./${candidate}.mp3`);
          return (
            <div
              className="candidate-card"
              key={candidate}
              onClick={() => {
                voteClick(candidate);
                playAudio(sound);
              }}
            >
              <img src={img} draggable="false" alt={candidate} />
              <div className="candidate-info">
                <h3>{candidate}</h3>
                <span>Votes: {votes.votes[candidate]}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bottom-section">
        <button
          onClick={() => {
            displayWinner();
            playAudio(sound);
          }}
        >
          Get winner
        </button>
        <button onClick={() => {
          clearVotes()
        }}>Reset score</button>
        <span>Winner is: {votes.winner || ''}</span>
      </div>
    </div>
  );
};

export default FumoVote;