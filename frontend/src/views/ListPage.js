import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const ListPage = () => {
  const { listId } = useParams();
  return (
    <div>
      <Header />
      <h1>List Page {listId}</h1>
      <Footer />
    </div>
  );
};

export default ListPage;
