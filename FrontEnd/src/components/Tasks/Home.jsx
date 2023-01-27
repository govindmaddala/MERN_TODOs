import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Index from "../Authentication";
import Navbar from "./Navbar";
import decodeToken from "jwt-decode";
import axios from "axios";
import { useRef } from "react";
import "./Home.css";
import { useState } from "react";

const Home = ({ isLogged, setIsLogged, setUser, logoutFunction, user }) => {
  const navigate = useNavigate();

  const searchItem = useRef();
  const dateBar = useRef();

  const [todayTasks, setTodayTasks] = useState([]);
  var username = useRef("User");
  useEffect(() => {
    var token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      var decodedUser = decodeToken(token);
      axios.get(`/user/${decodedUser.id}`).then((resp) => {
        if (resp.status === 200) {
          username.current = resp.data.username;
          username.current =
            username.current[0].toLocaleUpperCase() + username.current.slice(1);
          setUser(decodedUser);
          setIsLogged(true);
        }
      });
      axios.post("/tasks/today", { userID: decodedUser.id }).then((resp) => {
        if (resp.data.message.length !== 0) {
          setTodayTasks(resp.data.message[0].tasks);
        } else {
          setTodayTasks([]);
        }
      });
    } else {
      setUser(false);
      setIsLogged(false);
      navigate("/");
    }
  }, [setUser, setIsLogged, navigate]);

  const [taskData, setTaskData] = useState({
    taskHeading: "",
    taskDetails: "",
  });

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getTasksByDateChange = () => {
    var dateSet = new Date(dateBar.current.value)
      .toLocaleDateString()
      .toString();
    if (dateSet === "Invalid Date") {
      dateSet = new Date().toLocaleDateString().toString();
    }
    var [month, day, year] = dateSet.split("/");
    dateSet = `${day}/${month}/${year}`;
    var token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      var decodedUser = decodeToken(token);
      axios
        .post(`/tasks/?date=${dateSet}`, { userID: decodedUser.id })
        .then((resp) => {
          if (resp.data.message.length !== 0) {
            setTodayTasks(resp.data.message[0].tasks);
          } else {
            setTodayTasks([]);
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    } else {
      setUser(false);
      setIsLogged(false);
      navigate("/");
    }
  };

  const addTaskForm = (e) => {
    e.preventDefault();
    var dateSet = new Date(dateBar.current.value)
      .toLocaleDateString()
      .toString();
    if (dateSet === "Invalid Date") {
      dateSet = new Date().toLocaleDateString().toString();
    }
    var [month, day, year] = dateSet.split("/");
    dateSet = `${day}/${month}/${year}`;

    var token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      var decodedUser = decodeToken(token);
      var userID = decodedUser.id;
      var newTaskDetails = {
        userID,
        taskDate: dateSet,
        taskHeading: taskData.taskHeading,
        taskDetails: taskData.taskDetails,
      };
      if (taskData.taskHeading !== "") {
        axios
          .post("/tasks/new", newTaskDetails)
          .then((resp) => {
            if (resp.data.message.tasks.length !== 0) {
              setTodayTasks(resp.data.message.tasks);
              setTaskData({
                taskHeading: "",
                taskDetails: "",
              });
            } else {
              setTodayTasks([]);
            }
          })
          .catch((err) => {
            alert("Task Heading is required.");
          });
      } else {
        alert("Task Heading is required.");
      }
    } else {
      setUser(false);
      setIsLogged(false);
      navigate("/", { replace: "true" });
    }
  };

  const deleteTask = (id) => {
    axios
      .delete(`/tasks/${user.id}/delete/${id}`)
      .then((resp) => {
        setTodayTasks(resp.data.message[0].tasks);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return isLogged ? (
    <>
      <div id="top">
        <Navbar
          searchItem={searchItem}
          dateBar={dateBar}
          logoutFunction={logoutFunction}
          getTasksByDateChange={getTasksByDateChange}
          setIsLogged={setIsLogged}
          setUser={setUser}
          username={username.current}
        />
        <form id="taskUpdateContainer" onSubmit={addTaskForm}>
          <input
            type="text"
            id="taskHeading"
            name="taskHeading"
            placeholder="Task Heading*"
            value={taskData.taskHeading}
            onChange={handleTaskChange}
          />
          <textarea
            name="taskDetails"
            cols="30"
            rows="10"
            id="taskDetails"
            placeholder="Task Details"
            value={taskData.taskDetails}
            onChange={handleTaskChange}
          />
          <button id="addTaskButton">Add</button>
        </form>
      </div>

      <div id="bottom">
        <div id="planningSection">
          <h1 className="taskSectionHeading">Planning</h1>
          <ul id="planningTasks">
            {todayTasks.length > 0 ? (
              todayTasks.map((each) => {
                const { taskHeading, taskDetails, _id } = each;
                return (
                  <li key={_id} className="eachTask">
                    <h3 className="taskHeading" title={taskDetails} id={_id}>
                      {taskHeading}
                    </h3>
                    <button
                      className="deleteButton"
                      onClick={() => {
                        deleteTask(_id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                );
              })
            ) : (
              <div id="noTaskMessage">Ponder and plan</div>
            )}
          </ul>
        </div>

        {/* <ul id="inprogress">
          <h1 className="taskSectionHeading">In-Progress</h1>
          {todayTasks.length > 0 ? (
            todayTasks.map((each) => {
              const { taskHeading, taskDetails, _id } = each;
              return (
                <li key={_id} className="eachTask">
                  <h3 className="taskHeading" title={taskDetails} id={_id}>
                    {taskHeading}
                  </h3>
                  <button>Delete</button>
                </li>
              );
            })
          ) : (
            <div id="noTaskMessage">Slow and steady win the race...</div>
          )}
        </ul>

        <ul id="finished">
          <h1 className="taskSectionHeading">Finished</h1>
          {todayTasks.length > 0 ? (
            todayTasks.map((each) => {
              const { taskHeading, taskDetails, _id } = each;
              return (
                <li key={_id} className="eachTask">
                  <h3 className="taskHeading" title={taskDetails} id={_id}>
                    {taskHeading}
                  </h3>
                  <button
                    onClick={() => {
                      deleteTask(_id);
                    }}
                  >
                    Delete
                  </button>
                </li>
              );
            })
          ) : (
            <div id="noTaskMessage">Successfully finished all</div>
          )}
        </ul> */}
      </div>
    </>
  ) : (
    <></>
  );
};

export default Home;
