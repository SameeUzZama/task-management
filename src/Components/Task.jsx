import React, { Fragment, useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeletIcon from "@material-ui/icons/Delete";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  Paper,
  Typography,
} from "@material-ui/core";
import { writeFile, utils } from "xlsx";

export const Task = () => {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState([]);
  const [itemsDone, setItemsDone] = useState([]);
  const [itemsDoneCheck, setItemsDoneCheck] = useState(false);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [editItems, setEditItems] = useState(null);
  const [dis, setDis] = useState(true);

  const addItem = () => {
    if (!inputData) {
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          if (elem.id === editItems) {
            return { ...elem, name: inputData };
          }
          return elem;
        })
      );
      setToggleSubmit(true);
      setInputData(" ");
      setEditItems(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
        completed: false,
      };
      setItems([...items, allInputData]);
      setInputData(" ");
    }
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((elem) => {
      return index !== elem.id;
    });
    setItems(updatedItems);
  };

  const editItem = (id) => {
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });
    setToggleSubmit(false);
    setInputData(newEditItem.name);
    setEditItems(id);
  };

  const completeTodo = (e, elem) => {
    setItems(
      items.map((item) => {
        if (item.id === elem) {
          item.completed = e.target.checked;
        }
        return item;
      })
    );
  };

  const sortDone = () => {
    setItemsDoneCheck(true);
    let arr = items.filter((item) => item.completed === true);
    setItemsDone(arr);
  };

  const sortTodo = () => {
    setItemsDoneCheck(true);
    let arr = items.filter((item) => item.completed === false);
    setItemsDone(arr);
  };

  const handelKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleExport = () => {
    const data = items.map((item) => ({
      TaskName: item.name,
      Status: item.completed ? "Done" : "Pending",
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Tasks");
    writeFile(wb, "Tasks.xlsx");
  };

  useEffect(() => {
    if (inputData.length > 0) {
      setDis(false);
    }
  }, [inputData]);

  const styles = {
    Paper: {
      padding: 20,
      margin: "auto",
      textAlign: "center",
      maxWidth: 600,
    },
    Paper2: {
      margin: "auto",
      padding: 10,
      display: "flex",
      alignItems: "center",
      marginTop: 10,
      width: 500,
    },
    Icon: {
      marginLeft: "auto",
    },
    Check: {
      display: "flex",
      marginLeft: "auto",
      alignItems: "center",
      flexDirection: "row-reverse",
    },
  };
  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={styles.Paper}>
            <Typography>TaskManagement</Typography>
            <form>
              <Input
                type="text"
                placeholder="New Todo"
                value={inputData}
                maxLength={30}
                onKeyDown={(e) => {
                  handelKeyDown(e);
                }}
                onChange={(e) => {
                  e.preventDefault();
                  setInputData(e.target.value);
                }}
                style={{ width: "60%" }}
              />
              {toggleSubmit ? (
                <Button
                  disabled={dis}
                  onClick={addItem}
                  variant="contained"
                  color="primary"
                >
                  Add new Task
                </Button>
              ) : (
                <Button onClick={addItem} color="primary" variant="contained">
                  Edit Task
                </Button>
              )}
            </form>
            <Grid item xs={8} style={styles.Paper}>
              <Typography>TodoList</Typography>
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setItemsDoneCheck(false);
                  }}
                >
                  All list
                </Button>
                <Button color="primary" variant="contained" onClick={sortDone}>
                  Completed List
                </Button>
                <Button color="primary" variant="contained" onClick={sortTodo}>
                  Pending List
                </Button>
              </ButtonGroup>
              <Box style={styles.Paper}>
                {!itemsDoneCheck && (
                  <List>
                    {items.map((elem, index) => {
                      return (
                        <Box key={index}>
                          <ListItem key={elem.id}>
                            <Paper style={styles.Paper2}>
                              <Typography>{elem.name}</Typography>
                              <Box style={styles.Check}>
                                <IconButton
                                  color="primary"
                                  style={styles.Icon}
                                  onClick={() => editItem(elem.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  style={styles.Icon}
                                  onClick={() => deleteItem(elem.id)}
                                >
                                  <DeletIcon />
                                </IconButton>
                                <IconButton color="primary" style={styles.Icon}>
                                  <input
                                    onChange={(e) => completeTodo(e, elem.id)}
                                    type="checkbox"
                                    checked={elem.completed}
                                  />
                                </IconButton>
                              </Box>
                            </Paper>
                          </ListItem>
                        </Box>
                      );
                    })}
                  </List>
                )}
                {itemsDoneCheck && (
                  <List>
                    {itemsDone.map((elem, index) => {
                      return (
                        <Box key={index}>
                          <ListItem key={elem.id}>
                            <Paper style={styles.Paper2}>
                              <Typography>{elem.name}</Typography>
                              <Box style={styles.Check}>
                                <IconButton
                                  color="primary"
                                  style={styles.Icon}
                                  onClick={() => editItem(elem.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  style={styles.Icon}
                                  onClick={() => deleteItem(elem.id)}
                                >
                                  <DeletIcon />
                                </IconButton>
                                <IconButton color="primary" style={styles.Icon}>
                                  <input
                                    onChange={(e) => completeTodo(e, elem.id)}
                                    type="checkbox"
                                    checked={elem.completed}
                                  />
                                </IconButton>
                              </Box>
                            </Paper>
                          </ListItem>
                        </Box>
                      );
                    })}
                  </List>
                )}
              </Box>
            </Grid>
            <Grid>
              <Button
                onClick={handleExport}
                color="primary"
                variant="contained"
              >
                Export To Excel
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Task;
