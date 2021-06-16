import '../css/App.css';
import React from 'react';
import { render } from 'react-dom';

class Table extends React.Component{
  constructor(props) {
    super(props);
    this.state = {table: ""};
  }

  async componentDidMount() { ///////////////////////////надо сделать чтоб срабатывало при апдейте

    const data = {
      tableName: this.props.tableName
    }
    let columnNames;
    let primaryKey;
    let table = [];


    let res = await fetch(`/api/meta/getColumnNames`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    let answer = await res.json();
    columnNames = answer["columnNames"].map(elem => elem["COLUMN_NAME"]);
    console.log(columnNames);

    res = await fetch(`/api/meta/getPK`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    answer = await res.json();
    primaryKey = answer["primaryKey"][0]["COLUMN_NAME"];
    console.log(primaryKey);
    

    let row = columnNames.map(columnName => <td>{columnName}</td>);//////////////ругается что теги td вложены друг вдруга 
    row.push(<td>Изменить</td>);                                    /////////////и хочет уникальные ключи
    row.push(<td>Удалить</td>);
    table.push(<tr>{row}</tr>)

    this.props.table.forEach(element => {
      let row = Object.values(element);
      row.push(<td><Change key={element[primaryKey]}/></td>);
      row.push(<td><Delete key={element[primaryKey]} tableName={this.props.tableName} column={primaryKey} value={element[primaryKey]}/></td>);
      row = row.map(value => <td>{value}</td>);
      table.push(<tr>{row}</tr>);
    });

    this.setState({table : table});
  }

  render () {
    return <table>
      {this.state.table}
    </table>
  }
}

async function showTable(tableName) {
  fetch(`/api/${tableName}`)
    .then(res => {
      res.json()
      .then(data => {
        render(
          <Table tableName={tableName} table={data["content"]}/>,
          document.getElementById("workSpace")
        )
      })
    }
  )
}

async function deleteRow(tableName, column, value) {
  const data = {
    tableName: tableName,
    column: column,
    value: value
  }
  //console.log(JSON.stringify(data));

  fetch(`/api/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      res.json()
      .then(data => {
        console.log(data);
      })
    }
  )
}

async function addRow() {

}

async function changeRow() {

}

function Delete(props) {
  return <button className="utilityButton" onClick={() => {
    deleteRow(props.tableName, props.column, props.value);
    showTable(props.tableName)}}>
    ×
  </button>
}

function Change(props) {
  return <button className="utilityButton" onClick={() => changeRow(props.tableName, props.condition, props.data)}>
    ✎
  </button>
}

function ShowTable(props) {
  return <button className="TablesButton" onClick={() => showTable(props.tableName)}>
    {props.tableName}
  </button>
}

class ToolBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {tableButtons: ""};
  }
  
  componentDidMount() {
    fetch(`/api/meta/getTableNames`)
    .then(res => {
      res.json()
      .then(data => {
        const tableNames = data["tableNames"].map(elem => elem["TABLE_NAME"]);
        const tableButtons = tableNames.map(tableName => <ShowTable key={tableName} tableName={tableName}/>)
        this.setState({tableButtons : tableButtons});
      })
    }
    )
  }
  render () {
    //console.log(this.state.tableButtons);
    return <div id="toolBar">
      {this.state.tableButtons}
    </div>
  }
}

function App() {
  return (
    <div className="App">
      <div id="workSpace"/>
        <ToolBar/>
    </div>
  );
}

export default App;
