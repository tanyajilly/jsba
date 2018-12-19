import { createStore, combineReducers } from 'redux';
import { data } from './data';
import { generate as id } from 'shortid';

// Reducers
const status = (currentState = 0, action) => {
  switch (action.type) {
    case 'SELECT_STATUS':
      const nextState = action.status;
      return nextState;
    default:
      return currentState;
  }
};

const players = (currentState = [], action) => {
  switch (action.type) {
    case 'ADD_PLAYER':
      const nextState = [
        ...currentState,
        {
          id: id(),
          name: action.name,
          result: 0,
          status: 3,
        },
      ];
      return nextState;
      break;
    default:
      return currentState;
  }
};

const selectStatus = status => {
  return {
    type: 'SELECT_STATUS',
    status,
  };
};

const addPlayer = name => {
  return {
    type: 'ADD_PLAYER',
    name,
  };
};

const reducer = combineReducers({
  status,
  players,
});

const initialState = { status: 0, players: data.players };

const store = createStore(reducer, initialState);

const templateTableComponent = (
  { _, name, result, status },
  index,
  selectedStatus
) => {
  return `
    <tr ${selectedStatus == status ? 'class="table-info"' : ''}>
      <td>${index + 1}</td>
      <td>${name}</td>
      <td>${result}</td>
      <td>${status}</td>
    </tr>
  `;
};

document.forms.addPlayer.addEventListener('submit', e => {
  e.preventDefault();
  const playerName = e.target.name.value;
  store.dispatch(addPlayer(playerName));
  e.target.name.value = '';
  render();
});

document
  .querySelector('#status-select')
  .addEventListener('change', ({ target }) => {
    store.dispatch(selectStatus(target.value));
    render();
  });

const render = () => {
  const { status, players } = store.getState();
  document.querySelector('#results').innerHTML = players
    .map(function(element, index) {
      return templateTableComponent(element, index, status);
    })
    .join('');
};

const statusList = data.statuses;
const select = document.querySelector('#status-select');
statusList.forEach(item => {
  var option = document.createElement('option');
  option.value = item.id;
  option.text = item.title;
  select.add(option);
});

render();
