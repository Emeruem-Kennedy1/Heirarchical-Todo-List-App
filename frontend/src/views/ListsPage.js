import React, { useState, useCallback, useEffect } from "react";
import ListCard from "../components/ListCard";
import { useApi } from "../contexts/ApiProvider";
import Box from "@mui/material/Box";
import AddListForm from "../components/AddListForm";

const ListsPage = () => {
  const api = useApi();
  const [lists, setLists] = useState([]);

  const updateLists = useCallback(() => {
    api.get("/lists").then((response) => {
      if (!response.ok) return console.error("Error fetching lists:", response);
      setLists(response.body.lists);
      // store the lists in the local storage
      localStorage.setItem("lists", JSON.stringify(response.body.lists));
    });
  }, [api]);

  useEffect(() => {
    updateLists();
  }, [updateLists]);

  return (
    <div>
      <Box
        height="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding="1rem"
      >
        <AddListForm onUpdateLists={updateLists} />

        <Box display="flex" justifyContent="center" flexWrap="wrap" padding={2}>
          {lists.map((list) => (
            <Box key={list.id} margin={1}>
              <ListCard
                list_id={list.id}
                list_name={list.name}
                onUpdateLists={updateLists}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ListsPage;
