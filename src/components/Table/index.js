/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import Charts from "../Charts";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";

fontawesome.library.add(faTrash);

export const getRandomUserData = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://randomuser.me/api/?results=200")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const DataTable = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getRandomUserData().then((results) => {
      const formattedResult = results.data.results.map((item) => {
        return {
          name: item.name.first + " " + item.name.last,
          location: item.location.city + "," + item.location.country,
          registered: moment(item.dob.date).format("DD/MM/YYYY"),
          phone: item.phone,
          picture: item.picture.medium,
          email: item.email,
        };
      });
      setUserList(formattedResult);
    });
  }, [setUserList]);

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "location",
      text: "Location",
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "registered",
      text: "Registered",
      sort: true,
      filter: textFilter(),
    },
    { dataField: "phone", text: "Phone", filter: textFilter() },
    {
      dataField: "picture",
      text: "Picture",
      formatter: (cell, row) => {
        return (
          <img
            alt=""
            src={row.picture}
            width="30px"
            height="30px"
            className="rounded-circle"
          />
        );
      },
    },
    {
      dataField: "",
      text: "Actions",
      formatter: (cell, row) => {
        return (
          <>
            <FontAwesomeIcon
              style={{ color: "lightsalmon" }}
              onClick={() => {
                const filteredData = userList.filter(
                  (item) => item.email !== row.email
                );
                setUserList(filteredData);
              }}
              icon={faTrash}
            />
          </>
        );
      },
    },
  ];

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 20,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    hideSizePerPage: true,
    alwaysShowAllBtns: false,
  });

  return (
    <>
      <Charts />
      <BootstrapTable
        bootstrap4
        keyField="email"
        columns={columns}
        data={userList}
        pagination={pagination}
        filter={filterFactory()}
        noDataIndication={"No matching records found"}
        stripped
        hover
        bordered
        rowStyle={{
          textAlign: "left",
          wordBreak: "break-word",
          cursor: "pointer",
        }}
        headerWrapperClasses="text-left word-break"
        size="sm"
        wrapperClasses="table-responsive"
      />
    </>
  );
};

export default DataTable;
