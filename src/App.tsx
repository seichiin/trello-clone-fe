import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./stores";
import { useGetTodosQuery } from "./stores/services/todo";
import { commonActions } from "./stores/slices/common";

const App = () => {
  const dispatch = useDispatch();
  const { data: todosData } = useGetTodosQuery();

  const message = useSelector((state: AppState) => state.common.message);

  const handleChangeMessage = () => {
    dispatch(commonActions.setMessage("new message!"));
  };

  console.log(todosData, "dadada");

  return (
    <>
      <Button onClick={handleChangeMessage}>Click to set message</Button>
      <Typography>{message}</Typography>
    </>
  );
};

export default App;