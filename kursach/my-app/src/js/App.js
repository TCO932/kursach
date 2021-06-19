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
  if(props.form) {
    let inputs = [];
    let fields = [];
    for (let i = 0; i < props.form.columns.length; i++) {
      const field = {
        "name": props.form.columns[i].name,
        "type": props.form.columns[i].type,
        "value": props.form.data[props.form.columns[i].name]
      }
      fields.push(field);
    }

    inputs = fields.map(field => 
      <p>{field.name}<br/>
        <input type={field.type} defaultValue={field.value} id={field.name+"form"}></input>
      </p>
    )

    return <div className="form">
      {inputs}
      <button className="insertButton" onClick={() => {props.setActive(false)}}>Отмена</button>
      <button className="insertButton" onClick={() => {  //data = {columns:[], values:[]}
        let columns = [];
        let values = [];
        fields.forEach(field => {
          columns.push(field.name);
          values.push(document.getElementById(field.name+"form").value);
        });
        
        let data = {
          columns: columns,
          values: values
        };
        edit(props.form.tableName, props.form.condition, data);
        showTable(props.form.tableName, props.setActive, props.setModalForm);
        props.setActive(false)
      }} >Сохранить</button>
    </div>
  }

  //edit(props.tableName, props.condition, props.data);
  return <span>Ошибка!</span>
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

  if(props.table) {//Object.values
    props.table.forEach(element => {
      row = Object.values(element).map(td => <td>{td}</td>);
      row.push(<td><Change setActive={props.setActive} tableName={props.tableName} columns={columns} condition={{column: props.primaryKey, value: element[props.primaryKey]}} data={element} setModalForm={props.setModalForm}/></td>);
      row.push(<td><Delete setActive={props.setActive} tableName={props.tableName} column={props.primaryKey} value={element[props.primaryKey]} setModalForm={props.setModalForm}/></td>);
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

async function edit(tableName, condition, data) {
  if (condition) {
    const req = {
      tableName: tableName,
      condition: condition,
      data: data,
    }
    console.log(req);
    const res = await fetch(`/api/getColumnValue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });
    const answer = await res.json();
    console.log("getColumnName: ",answer);
    if (answer) {
      update(tableName, condition, data);
    }
  } else {
    insert(tableName, data)
  }
}

async function update(tableName, condition, data) { // tableName="" condition={column, value} data=[{column, value}..]
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
      })
    }
  )
}

async function insert(tableName, data) { // tableName="" condition={column, value} data=[{column, value}..]
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
      })
    }
  )
}

function Delete(props) {
  return <button className="utilityButton" onClick={() => {
    deleteRow(props.tableName, props.column, props.value);
    showTable(props.tableName, props.setActive, props.setModalForm)}}>
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
  
  async componentDidMount() {
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
  const [modalForm, setModalForm] = useState(false);
  return (
    <div className="App">
      <div id="workSpace"/>
      <ToolBar setActive={setModalActive} setModalForm={setModalForm}/>
      <Modal active={modalActive} setActive={setModalActive}>
        <Insert setActive={setModalActive} setModalForm={setModalForm} form={modalForm}/>
      </Modal>
    </div>
  );
}

export default App;
