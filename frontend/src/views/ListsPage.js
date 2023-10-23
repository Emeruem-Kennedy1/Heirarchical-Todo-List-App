import React, { useState, useCallback } from "react";
import ListCard from "../components/ListCard";
import { useApi } from "../contexts/ApiProvider";
import Box from "@mui/material/Box";
import AddListForm from "../components/AddListForm";

const ListsPage = () => {
  const api = useApi();
  const [lists, setLists] = useState([]);

  const updateLists = useCallback(() => {
    api.get("/lists").then((response) => {
      setLists(response.body.lists);
    });
  }, [api]);

  React.useEffect(() => {
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
