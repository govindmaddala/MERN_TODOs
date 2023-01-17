import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Index from "../Authentication";
import Navbar from "./Navbar";
import decodeToken from 'jwt-decode'
import axios from "axios";
import { useRef } from "react";
import './Home.css'
import { useState } from "react";

const Home = ({ isLogged,setIsLogged,setUser,logoutFunction}) => {
  const navigate = useNavigate();

  const searchItem = useRef();
  const dateBar = useRef();

  const [todayTasks,setTodayTasks] = useState([])

  useEffect(() => {
    var token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
        var decodedUser = decodeToken(token);
        axios.get(`/user/${decodedUser.id}`).then((resp) => {
            if (resp.status === 200) {
                setUser(decodedUser);
                setIsLogged(true);
            }
        });
        axios.post('/tasks/today',{userID:decodedUser.id}).then((resp)=>{
          console.log();
          if(resp.data.message.length !== 0){
            setTodayTasks(resp.data.message[0].tasks)
          }else{
            setTodayTasks([]);
          }
        })
    } else {
        setUser(false);
        setIsLogged(false);
        navigate('/')
    }
}, [setUser,setIsLogged,navigate]);

const [taskData,setTaskData] = useState({
  taskHeading:"",
  taskDetails:"",
})

const handleTaskChange = (e)=>{
  const {name,value} = e.target;
  setTaskData((prev)=>{
    return {
      ...prev,
      [name]:value
    }
  });
}

const addTaskForm = (e)=>{
  e.preventDefault();
}


  return isLogged ? (
    <>
      <Navbar searchItem={searchItem} dateBar={dateBar} logoutFunction={logoutFunction}  />
      <form id="taskUpdateContainer" onSubmit={addTaskForm}>
        <input type="text" id="taskHeading" name="taskHeading" placeholder="Task Heading*" value={taskData.taskHeading} onChange={handleTaskChange} />
        <textarea name="taskDetails" cols="30" rows="10" id="taskDetails" placeholder="Task Details" value={taskData.taskDetails} onChange={handleTaskChange}/>
        {/* <div id="stylings">
          <h2 id="boldButton"><strong>B</strong></h2>
          <h2 id="italicButton"> <i>I</i> </h2>
        </div> */}
        <button id="addTaskButton">Add</button>
      </form>

      <div id="tasks">
        {todayTasks.length > 0 ?
        todayTasks.map((each)=>{
          const {taskHeading,taskDetails,status,_id} = each;
          return <div key={_id}>
              <h2>{taskHeading}</h2>
              <h3>{taskDetails}</h3>
              <h4>{status}</h4>
          </div>
        }):
        <div>No Tasks..Add one</div>
        }
      </div>
    </>
  ) : (
    <>
      
    </>
  );
};

export default Home;
