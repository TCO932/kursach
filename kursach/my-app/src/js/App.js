import '../css/App.css';
import { useState } from 'react';
import { render } from 'react-dom';

function Table(props){
  return <span>
    {props.table}
  </span> 
}

async function showTable(tableName) {
  const request = await fetch(`/api/${tableName}`);
  console.log("only fetch", request["content"]);
  render(
    <Table table={request["content"]}/>,
    document.getElementById("workSpace")
  );
}

function ShowWorkTable(props) {
  return <button className="TablesButton" onClick={() => showTable(props.tableName)}>
    Work
  </button>
}

function ShowSubjectTable(props) {
  return <button className="TablesButton" onClick={() => showTable(props.tableName)}>
    Subject
  </button>
}

function ShowPersonTable() {
  return <button className="TablesButton">
    Person
  </button>
}

function ShowStudentTable() {
  return <button className="TablesButton">
    Student
  </button>
}
function ShowSupervisorTable() {
  return <button className="TablesButton">
    Supervisor
  </button>
}
function ShowStudentGroupTable() {
  return <button className="TablesButton">
    StudentGroup
  </button>
}
function ShowSpecialityTable() {
  return <button className="TablesButton">
    Speciality
  </button>
}
function ShowPartOfTable() {
  return <button className="TablesButton">
    PartOfTable
  </button>
}

function ToolBar(){
  return <div id="toolBar">
    <ShowWorkTable tableName="work"/>
    <ShowSubjectTable tableName="subject"/>
    <ShowPersonTable tableName="person"/>
    <ShowStudentTable tableName="student"/>
    <ShowSupervisorTable tableName="supervisor"/>
    <ShowStudentGroupTable tableName="student_group"/>
    <ShowSpecialityTable tableName="speciality"/>
    <ShowPartOfTable tableName="part_of"/>
  </div>
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
