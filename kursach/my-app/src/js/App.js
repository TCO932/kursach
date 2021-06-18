import '../css/App.css';
import React, {useEffect, useState} from 'react';
import { render } from 'react-dom';

function Modal(props) {
  return (
    <div className={props.active ? "modal active" : "modal"} onClick={() => props.setActive(false)}>
      <div className="modal__content" onClick={e => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
}

function Insert(props) { //tableName, condition, columns //column name and type, props.data, // column name and value
  let inputs = [];
  console.log(props.form);
  for (let i = 0; i < props.form.columns.length; i++) {
    const element = props.form.columns[i];
    inputs.push(
    <p>{props.form.columns[i].name}<br/>
      <input type={props.form.columns[i].type} defaultValue={props.form.data[props.form.columns[i].name]} />
    </p>);
  }
  //edit(props.tableName, props.condition, props.data);

  return <div>
    {inputs}
    <button className="insertButton" onClick={() => {props.setActive(false)}}>Отмена</button>
    <button className="insertButton" onClick={() => {props.setActive(false)}} >Сохранить</button>
  </div>
}

function Table(props) {// props. tableName = "" columns = [{"COLUMN_NAME"}, {"DATA_TYPE"}] primaryKey = "" table [{}...{}]
  let table = [];

  let row = props.columns.map(column => <td>{column["COLUMN_NAME"]}</td>);
  row.push(<td>Изменить</td>);
  row.push(<td>Удалить</td>);
  table.push(<tr>{row}</tr>);

  let columns = [];
  props.columns.forEach(element => {
    let type = "text";
    if (element["DATA_TYPE"] === "int")
      type = "number";
    else
     if (element["DATA_TYPE"] === "date")
        type = "date";
    columns.push({type: type, name: element["COLUMN_NAME"]});
  });
  console.log(columns);

  if(props.table) {//Object.values
    props.table.forEach(element => {
      row = Object.values(element).map(td => <td>{td}</td>);
      row.push(<td><Change setActive={props.setActive} tableName={props.tableName} columns={columns} condition={{column: props.primaryKey, value: element[props.primaryKey]}} data={element} setModalForm={props.setModalForm}/></td>);
      row.push(<td><Delete setActive={props.setActive} tableName={props.tableName} column={props.primaryKey} value={element[props.primaryKey]}/></td>);
      table.push(<tr>{row}</tr>);
    });
  }
  
  return <table>
    {table}
  </table>;
}

async function showTable(tableName, setActive, setModalForm) {
  const data = {
    tableName: tableName
  }
  
  // getting columns
  let res = await fetch(`/api/meta/getColumnNames`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  let answer = await res.json();
  const columns = answer["columns"];
  
  // getting PK
  let primaryKey;
  res = await fetch(`/api/meta/getPK`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  answer = await res.json();
  primaryKey = answer["primaryKey"][0]["COLUMN_NAME"];

  // getting table data
  res = await fetch(`/api/${tableName}`);
  answer = await res.json();
  const table = answer["content"];

  render(
    <Table tableName={tableName} columns={columns} primaryKey={primaryKey} table={table} setActive={setActive} setModalForm={setModalForm}/>,
    document.getElementById("workSpace")
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

async function edit(tableName, condition, data, callback) {
  if (condition) {
    const req = {
      tableName: tableName,
      condition: condition,
      data: data,
    }
    
    const res = await fetch(`/api/getColumnValue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });
    const answer = await res.json();
    if (answer) {
      update(tableName, condition, data, callback);
    }
  } else {
    insert(tableName, data, callback)
  }
}

async function update(tableName, condition, data, callback) { // tableName="" condition={column, value} data=[{column, value}..]
  const req = {
    tableName: tableName,
    condition: condition,
    data: data,
  }
  
  fetch(`/api/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  })
    .then(res => {
      res.json()
      .then(data => {
        callback();
      })
    }
  )
}

async function insert(tableName, data, callback) { // tableName="" condition={column, value} data=[{column, value}..]
  const req = {
    tableName: tableName,
    data: data,
  }
  
  fetch(`/api/insert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req)
  })
    .then(res => {
      res.json()
      .then(data => {
        callback();
      })
    }
  )
}

function Delete(props) {
  return <button className="utilityButton" onClick={() => {
    deleteRow(props.tableName, props.column, props.value);
    showTable(props.tableName, props.setActive)}}>
    ×
  </button>
}

//Change setActive={props.setActive} tableName={props.tableName} columns={columns} condition={{column: props.primaryKey, value: element[props.primaryKey]}} data={element} setModalForm={props.setModalForm}/></td>);
function Change(props) {
  const form = {
    tableName: props.tableName,
    condition: props.condition,
    columns: props.columns, // column name and type
    data: props.data, // column name and value
  }

  return (
  <button className="utilityButton"  onClick={() => {
    props.setActive(true);
    props.setModalForm(form);
    }}>
    ✎
  </button>)
}

function ShowTable(props) {
  return <button className="TablesButton" onClick={() => showTable(props.tableName, props.setActive, props.setModalForm)}>
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
        const tableButtons = tableNames.map(tableName => <ShowTable key={tableName} tableName={tableName} setActive={this.props.setActive} setModalForm={this.props.setModalForm}/>)
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
  const [modalActive, setModalActive] = useState(false);
  const [modalForm, setModalForm] = useState({});
  return (
    <div className="App">
      <div id="workSpace"/>
        <ToolBar setActive={setModalActive} setModalForm={setModalForm}/>
      <div/>
      <Modal active={modalActive} setActive={setModalActive}>
        <Insert setActive={setModalActive} form={modalForm}/>
      </Modal>
    </div>
  );
}

export default App;
