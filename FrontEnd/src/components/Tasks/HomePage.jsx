import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Select from "react-select";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import encryptData from "../utils/encryptData";
import decryptData from "../utils/decryptData";
import redirectURL from "../utils/redirectURL";
import { useNavigate } from "react-router-dom";
import { DatePicker, Space, message } from "antd";
import Grid from "./Grid";
import Counters from "./Counters";
import { Layout, Menu } from "antd";
const { RangePicker } = DatePicker;
const { Content, Sider } = Layout;

const HomePage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userID_found, setUserID_found] = useState(false);
  const [userID_key, setUserID_key] = useState("");
  const [dateRangeSelected, setDateRangeSelected] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskHeading, setTaskHeading] = useState("");
  const [rowData, setRowData] = useState([]);
  const [username, setUsername] = useState("");

  const [taskDetails, setTaskDetails] = useState("");
  const [taskRangeSelected, setTaskRangeSelected] = useState(null);
  // const [messageApi, contextHolder] = message.useMessage();

  const [yetToStartData, setYetToStartData] = useState([]);
  const [inProcessData, setInProcessData] = useState([]);
  const [finishedData, setFinishedData] = useState([]);
  const [allData, setAllData] = useState([]);

  const changeCounterAndGridData = (counterType) => {
    switch (counterType) {
      case "0":
        setRowData(yetToStartData);
        break;

      case "1":
        setRowData(inProcessData);
        break;

      case "2":
        setRowData(finishedData);
        break;
      default:
        setRowData(allData);
        break;
    }
  };

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const items = [
    getItem(username, "sub1", <SettingOutlined />, [getItem("Details", "1")]),
    getItem("Logout", "4", <LogoutOutlined onClick={logout} />),
  ];

  useEffect(() => {
    setloadShow("");
    const allValues = { ...localStorage };
    let keys = Object.keys(allValues);
    if (keys.length > 0) {
      for (let eachKey of keys) {
        if (decryptData(eachKey) === "user_id") {
          try {
            const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(decryptData(localStorage.getItem(eachKey)))) {
              const endpoint = "/checkUser";
              const base64URLEncoded = encryptData(endpoint);
              let params = {
                email: localStorage.getItem(eachKey),
              };

              redirectURL
                .post(`users/${base64URLEncoded}`, params)
                .then((response) => {
                  if (response.data.success) {
                    navigate("/home");
                    setUserID_key(eachKey);
                  }

                  // const tasksEndpoint = "/getUserTasks";
                  // redirectURL
                  //   .post(`tasks/${encryptData(tasksEndpoint)}`, params)
                  //   .then(async (resp) => {
                  //     if (resp.data.success) {
                  //       setRowData(resp.data.allTasks);
                  //       setAllData(resp.data.allTasks);

                  //       let allIds = [];

                  //       let YetToStartData = [];
                  //       let InProcessData = [];
                  //       let FinishedData = [];

                  //       await resp.data.allTasks.forEach((each) => {
                  //         if (!allIds.includes(each._id)) {
                  //           allIds.push(each._id);
                  //           if (each.task_status === "0") {
                  //             YetToStartData.push(each);
                  //           } else if (each.task_status === "1") {
                  //             InProcessData.push(each);
                  //           } else if (each.task_status === "2") {
                  //             FinishedData.push(each);
                  //           }
                  //         }
                  //       });

                  //       setYetToStartData(YetToStartData);
                  //       setInProcessData(InProcessData);
                  //       setFinishedData(FinishedData);
                  //     }
                  //   });
                  getTasksForUser(eachKey);
                })
                .catch((err) => {
                  console.log("login err", err);
                  navigate("/");
                  // localStorage.clear();
                });
            }
          } catch (error) {
            navigate("/");
          }
          setUserID_found(true);
          break;
        } else if (decryptData(eachKey) === "username") {
          setUsername(decryptData(localStorage.getItem(eachKey)));
        }
      }
    } else {
      navigate("/");
    }
    if (!userID_found) {
      navigate("/");
    }
  }, [userID_key, userID_found]);

  const getTasksForUser = (userID_key) => {
    setloadShow("");
    let params = {
      email: localStorage.getItem(userID_key),
    };
    const tasksEndpoint = "/getUserTasks";
    redirectURL
      .post(`tasks/${encryptData(tasksEndpoint)}`, params)
      .then(async (resp) => {
        if (resp.data.success) {
          setRowData(resp.data.allTasks);
          setAllData(resp.data.allTasks);

          let allIds = [];

          let YetToStartData = [];
          let InProcessData = [];
          let FinishedData = [];

          await resp.data.allTasks.forEach((each) => {
            if (!allIds.includes(each._id)) {
              allIds.push(each._id);
              if (each.task_status === "0") {
                YetToStartData.push(each);
              } else if (each.task_status === "1") {
                InProcessData.push(each);
              } else if (each.task_status === "2") {
                FinishedData.push(each);
              }
            }
          });

          setYetToStartData(YetToStartData);
          setInProcessData(InProcessData);
          setFinishedData(FinishedData);
          setloadShow("d-none");
        }
      });
  };

  const options = [
    { label: "Yet to Start", value: "0" },
    { label: "In Process", value: "1" },
    { label: "Finished", value: "2" },
  ];

  const handleSelect = (filterType, selectedOption) => {
    if (filterType === "taskStatus") {
      setTaskStatus(selectedOption);
    }
  };

  const addNewTask = (e) => {
    e.preventDefault();
    try {
      if (decryptData(localStorage.getItem(userID_key))) {
        const endpoint = "/newTask";
        let userId = localStorage.getItem(userID_key);
        const base64URLEncoded = encryptData(endpoint);
        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(decryptData(userId))) {
          let params = {
            email: userId,
            task_heading: encryptData(taskHeading),
            task_status: encryptData(taskStatus.value),
            task_details: encryptData(taskDetails),
            start_date: taskRangeSelected[0].$d,
            end_date: taskRangeSelected[1].$d,
          };

          redirectURL
            .post(`tasks/${base64URLEncoded}`, params)
            .then((response) => {
              if (response.data.success) {
                onCloseModal();
                setTaskHeading("");
                setTaskStatus("");
                setTaskDetails("");
                setTaskRangeSelected(null);
                getTasksForUser(userID_key);
              }
            })
            .catch((err) => {
              console.log("login err", err);
            });
        }
      } else {
        navigate("/");
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (variableType, data) => {
    if (variableType === "taskHeading") {
      setTaskHeading(data);
    }

    if (variableType === "taskDetails") {
      setTaskDetails(data);
    }
  };

  const handleFilterDate = (value, dateString) => {
    setDateRangeSelected(value);
  };

  const handleTaskDate = (value, dateString) => {
    setTaskRangeSelected(value);
  };

  const cancelTaskForm = () => {
    onCloseModal();
    setTaskHeading("");
    setTaskStatus("");
    setTaskDetails("");
    if (decryptData(localStorage.getItem("user_id"))) {
      onCloseModal();
      setTaskHeading("");
      setTaskStatus("");
      setTaskDetails("");
      setTaskRangeSelected(null);
    } else {
      navigate("/");
      localStorage.removeItem("user_id");
    }
  };

  const onOpenModal = () => {
    setOpen(true);
    setTaskRangeSelected(null);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  const [collapsed, setCollapsed] = useState(false);
  const [loadShow, setloadShow] = useState("d-none");

  return (
    <div>
      <div className="card">
        <Layout
          style={{
            minHeight: "100vh",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
              setCollapsed(value);
            }}
          >
            <div className="demo-logo-vertical" />
            <Menu theme="dark" mode="inline" items={items} />
          </Sider>

          <Layout>
            {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          
        /> */}
            <Content style={{ padding: "0 2vw" }}>
              <div
                className={loadShow}
                style={{
                  position: "absolute",
                  zIndex: "9999",
                  top: "40vh",
                  left: "50%",
                }}
              >
                <div
                  class="spinner-grow text-danger"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                ></div>
                <div
                  class="spinner-grow text-warning"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                ></div>
                <div
                  class="spinner-grow text-info"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                ></div>
              </div>
              <Modal open={open} onClose={onCloseModal}>
                <h6
                  style={{
                    width: "26vw",
                    height: "40px",
                    background: "black",
                    color: "white",
                    paddingTop: "10px",
                  }}
                  className="text-center"
                >
                  New Task
                </h6>
                <form action="" onSubmit={addNewTask}>
                  <div className="column py-3">
                    <label htmlFor="taskHeading">Task Heading</label>
                    <div>
                      <input
                        type="text"
                        id="taskHeading"
                        placeholder="Task Heading *"
                        className="w-100 p-2"
                        value={taskHeading}
                        onChange={(e) => {
                          handleChange("taskHeading", e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="column py-3">
                    <label htmlFor="">Task Status</label>
                    <Select
                      options={options}
                      value={taskStatus}
                      onChange={(selectedOption) => {
                        handleSelect("taskStatus", selectedOption);
                      }}
                      required
                    />
                  </div>
                  <div className="column py-3">
                    <label htmlFor="taskDetails">Task Details</label>
                    <div>
                      <textarea
                        className="p-2"
                        name="taskDetails"
                        id="taskDetails"
                        rows="4"
                        style={{ resize: "none", width: "100%" }}
                        placeholder="Enter Task Details"
                        value={taskDetails}
                        onChange={(e) => {
                          handleChange("taskDetails", e.target.value);
                        }}
                      ></textarea>
                    </div>
                  </div>
                  <div className="column py-3">
                    <label htmlFor="">Target Time</label>
                    <div>
                      <RangePicker
                        size={"middle"}
                        style={{ width: "100%" }}
                        value={taskRangeSelected}
                        onChange={handleTaskDate}
                        required
                        // disabled={
                        //   taskStatus === "" || taskStatus.value === "2"
                        //     ? "disabled"
                        //     : null
                        // }
                      />
                    </div>
                  </div>
                  <div className="row justify-content-between mx-0">
                    <button
                      type="button"
                      className="btn btn-danger col-5 pl-2"
                      onClick={cancelTaskForm}
                    >
                      Cancel Task
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary col-5 pr-2"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </Modal>

              <div
                className="row mx-0 justify-content-around mt-5"
                style={{ height: "116px" }}
              >
                <div className="card col-2 pt-3">
                  <div className="row mx-0 px-2">
                    <label htmlFor="" className="pb-1 text-center">
                      Create New Task
                    </label>
                    <button className="btn btn-primary" onClick={onOpenModal}>
                      Add
                    </button>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="col-9 card pt-3">
                  <form action="">
                    <div className="row justify-content-between mx-0 px-2">
                      <div className="col-5">
                        <div className="row">
                          <label htmlFor="" className="pb-2">
                            Target Range
                          </label>
                          <Space direction="vertical" size={16}>
                            <RangePicker
                              value={dateRangeSelected}
                              onChange={handleFilterDate}
                              format="DD-MM-YYYY"
                              style={{ width: "100%" }}
                              size={"large"}
                              required
                            />
                          </Space>
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="row">
                          <label htmlFor="" className="pb-2">
                            Task Status
                          </label>
                          <Select
                            options={options}
                            isMulti={true}
                            value={taskStatus}
                            onChange={(selectedOption) => {
                              handleSelect("taskStatus", selectedOption);
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-2 pt-4" style={{ marginTop: "5px" }}>
                        <div className="row">
                          <button className="btn btn-primary" type="submit">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div
                className="row mx-0 justify-content-around mt-5"
                style={{ height: "150px" }}
              >
                <div className="card col-12 ">
                  <Counters
                    changeCounterAndGridData={changeCounterAndGridData}
                    counters={{
                      allData: allData.length,
                      yetToStartData: yetToStartData.length,
                      inProcessData: inProcessData.length,
                      finishedData: finishedData.length,
                    }}
                  />
                </div>
              </div>

              <div className="row mx-0 justify-content-around mt-3">
                <div className="card col-12">
                  <Grid
                    rowData={rowData}
                    getTasksForUser={getTasksForUser}
                    userID_key={userID_key}
                  />
                </div>
              </div>

              <Space></Space>
            </Content>
            {/* <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer> */}
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default HomePage;
