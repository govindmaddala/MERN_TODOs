import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import CountDownCell from "./CountDownCell";
import { DeleteOutlined } from "@ant-design/icons";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import moment from "moment";
import encryptData from "../utils/encryptData";
import redirectURL from "../utils/redirectURL";

const Grid = (props) => {
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    pivot: true,
    enableValue: true,
    enableRowGroup: false,
  };

  const statusbar = {
    statusPanels: [
      {
        statusPanel: "agTotalAndFilteredRowCountComponent",
        align: "left",
      },
      {
        statusPanel: "agTotalRowCountComponent",
        align: "center",
      },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  };

  // const sideBar = {
  //   toolPanels: [
  //     {
  //       id: "columns",
  //       labelDefault: "Columns",
  //       labelKey: "columns",
  //       iconKey: "columns",
  //       toolPanel: "agColumnsToolPanel",
  //     },
  //     {
  //       id: "filters",
  //       labelDefault: "Filters",
  //       labelKey: "filters",
  //       iconKey: "filters",
  //       toolPanel: "agFiltersToolPanel",
  //     },
  //   ],
  // };

  const rowData = props.rowData;

  const deleteTask = (params) => {
    const endpoint = "/deleteTask";
    const base64URLEncoded = encryptData(endpoint);

    let payload = {
      _id: params.data._id,
    };

    redirectURL
      .post(`tasks/${base64URLEncoded}`, payload)
      .then((response) => {
        if (response.data.success) {
          props.getTasksForUser(props.userID_key);
        }
      })
      .catch((err) => {
        console.log("login err", err);
      });
  };

  const columnDefs = [
    {
      headerName: "Delete Task",
      cellRenderer: (params) => {
        return (
          <DeleteOutlined
            onClick={() => {
              deleteTask(params);
            }}
          />
        );
      },
    },
    {
      headerName: "Task",
      field: "task_heading",
    },
    {
      headerName: "Details",
      field: "task_details",
      width:470
    },
    {
      headerName: "Current Status",
      field: "task_status",
      cellStyle: (params) => {
        if (params.data.task_status === "0") {
          return { background: "#ed7272" };
        }

        if (params.data.task_status === "1") {
          return { background: "#eded5e" };
        }

        if (params.data.task_status === "2") {
          return { background: "#52f3c7c2" };
        }
      },
      valueGetter: (params) => {
        if (params.data.task_status === "0") {
          return "Yet to Start";
        }

        if (params.data.task_status === "1") {
          return "In Process";
        }

        if (params.data.task_status === "2") {
          return "Finished";
        }
      },
    },
    {
      headerName: "From",
      field: "start_date",
      valueGetter: (params) => {
        if (params.data.start_date) {
          return moment(params.data.start_date).format("DD-MMM-YYYY");
        } else {
          return "NA";
        }
      },
    },
    {
      headerName: "End",
      field: "end_date",
      valueGetter: (params) => {
        if (params.data.end_date) {
          return moment(params.data.end_date).format("DD-MMM-YYYY");
        } else {
          return "NA";
        }
      },
    },
    {
      headerName: "Count Down",
      field: "end_date",
      filter: true,
      sortable: true,
      cellRenderer: CountDownCell,
    },
  ];

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  return (
    <div>
      <div
        className="ag-theme-alpine pt-5 px-3 pb-3"
        style={{ height: "550px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableCharts={true}
          enableRangeSelection={true}
          statusBar={statusbar}
          sideBar={true}
          autoGroupColumnDef={autoGroupColumnDef}
          pagination={true}
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          rowSelection={"multiple"}
          rowGroupPanelShow={"always"}
          pivotPanelShow={"always"}
          paginationAutoPageSize={true}
          rowHeight={50}
        />
      </div>
    </div>
  );
};

export default Grid;
