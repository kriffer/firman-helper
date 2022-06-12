import {
  Button,
  Container,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import { useState } from "react";

import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const NetsReports = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState({});

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("report", selectedFile, selectedFile.name);
    console.log(selectedFile);
    axios.post("http://localhost:3002/upload", formData).then((responce) => {
      setTransactions(responce.data);
      const sum = responce.data.reduce(
        (acc, b) => acc + b.totalCapturedAmount,
        0
      );
      setTotal({ sum: sum });
    });
  };

  const saveToServer = () => {};

  const saveToPdf = () => {
    let doc = new jsPDF({ putOnlyUsedFonts: false, orientation: "landscape" });

    let sum = new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(total.sum);

    let ilmanAlv = new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format(total.sum / 1.1);

    let alv = new Intl.NumberFormat("fi-FI", {
      style: "currency",
      currency: "EUR",
    }).format((total.sum / 1.1) * 0.1);
    //   doc.setFont(700);
    doc.setFontSize(12);
    if (transactions && transactions.length > 0) {
      let date = transactions[0].timestamp.split(" ")[0].split("/");
      doc.text(
        `NETS transactions report for ${
          monthNames[new Date(`${date[2]}-${date[1]}-${date[0]}`).getMonth()]
        } ${new Date(`${date[2]}-${date[1]}-${date[0]}`).getFullYear()}`,
        150,
        20,
        null,
        null,
        "center"
      );
   
    doc.setFontSize(10);
    doc.text(`Total: ${sum}`, 15, 25);
    doc.text(`Ilman ALV: ${ilmanAlv}`, 15, 30);
    doc.text(`ALV (10%): ${alv}`, 15, 35);
    autoTable(doc, {
      columns: [
        { header: "transactionId", dataKey: "transactionId" },
        { header: "orderNumber", dataKey: "orderNumber" },
        { header: "description", dataKey: "description" },
        { header: "totalCapturedAmount", dataKey: "totalCapturedAmount" },
        { header: "issuer", dataKey: "issuer" },
        { header: "issuerCountry", dataKey: "issuerCountry" },
        { header: "timestamp", dataKey: "timestamp" },
        { header: "customer", dataKey: "customer" },
      ],
      body: transactions,
      margin: { top: 40 },
    });

    doc.save(`nets_transactions_${
        monthNames[new Date(`${date[2]}-${date[1]}-${date[0]}`).getMonth()]
      }_${new Date(`${date[2]}-${date[1]}-${date[0]}`).getFullYear()}.pdf`);
    }
  };

  const renderHeader = () => {
    let date = transactions[0].timestamp.split(" ")[0].split("/");
    return (
      <h2 align="center">
        {" "}
        NETS transactions report for{" "}
        {
          monthNames[new Date(`${date[2]}-${date[1]}-${date[0]}`).getMonth()]
        }{" "}
        {new Date(`${date[2]}-${date[1]}-${date[0]}`).getFullYear()}{" "}
      </h2>
    );
  };

  return (
    <div>
      <Grid item>
        <input type="file" onChange={onFileChange} />

        <Button onClick={onFileUpload}>Upload</Button>
      </Grid>
      <Grid>
        {transactions && transactions.length > 0 ? renderHeader() : ""}
      </Grid>
      <Grid item>
        <Table size="small" id="table">
          {transactions.length > 0 ? (
            <TableHead>
              <TableRow>
                <TableCell>transactionId</TableCell>
                <TableCell> orderNumber</TableCell>
                <TableCell> description</TableCell>
                <TableCell>totalCapturedAmount</TableCell>
                <TableCell> issuer</TableCell>
                <TableCell> issuerCountry</TableCell>
                <TableCell> timestamp</TableCell>
                <TableCell> customer</TableCell>
              </TableRow>
            </TableHead>
          ) : (
            ""
          )}
          {transactions.map((t) => (
            <TableRow>
              <TableCell>{t.transactionId}</TableCell>
              <TableCell>{t.orderNumber}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("fi-FI", {
                  style: "currency",
                  currency: "EUR",
                }).format(t.totalCapturedAmount)}
              </TableCell>
              <TableCell>{t.issuer}</TableCell>
              <TableCell>{t.issuerCountry}</TableCell>
              <TableCell>{t.timestamp}</TableCell>
              <TableCell>{t.customer}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Grid>
      {transactions.length > 0 ? (
        <Grid item>
          <div>
            Total:{" "}
            {new Intl.NumberFormat("fi-FI", {
              style: "currency",
              currency: "EUR",
            }).format(total.sum)}
          </div>
          <div>
            Ilman ALV:{" "}
            {new Intl.NumberFormat("fi-FI", {
              style: "currency",
              currency: "EUR",
            }).format(total.sum / 1.1)}
          </div>
          <div>
            ALV 10%:{" "}
            {new Intl.NumberFormat("fi-FI", {
              style: "currency",
              currency: "EUR",
            }).format((total.sum / 1.1) * 0.1)}
          </div>
        </Grid>
      ) : (
        ""
      )}

      <Grid>
        <Button onClick={saveToPdf}>Export to PDF</Button>
        <Button onClick={saveToServer}>Save to server</Button>
      </Grid>
      <Grid item>
        <h5>Previous reports:</h5>
      </Grid>
    </div>
  );
};

export default NetsReports;
