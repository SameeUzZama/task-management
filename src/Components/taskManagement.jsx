import React, { useState, useRef } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { writeFile, utils } from "xlsx";

const { Column } = Table;

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { taskName: "Task 1", description: "Task 1 Description", status: "To Do" },
    {
      taskName: "Task 2",
      description: "Task 2 Description",
      status: "In Progress",
    },
    { taskName: "Task 3", description: "Task 3 Description", status: "Done" },
  ]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [isAdd, setIsAdd] = useState(true);
  const formRef = useRef();

  const handleMove = (task, status) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.taskName === task.taskName) {
          t.status = status;
        }
        return t;
      })
    );
  };

  const handleUpdate = (task) => {
    setCurrentTask(task);
    setIsAdd(false);
    setModalVisibility(true);
  };

  const handleDelete = (task) => {
    setTasks((prevTasks) =>
      prevTasks.filter((t) => t.taskName !== task.taskName)
    );
  };

  const handleAdd = () => {
    setCurrentTask({});
    setIsAdd(true);
    setModalVisibility(true);
  };

  const handleCancel = () => {
    setModalVisibility(false);
    formRef.current.resetFields();
  };

  const handleSubmit = (values) => {
    if (isAdd) {
      setTasks((prevTasks) => [...prevTasks, values]);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.taskName === currentTask.taskName) {
            task = { ...task, ...values };
          }
          return task;
        })
      );
    }
    handleCancel();
  };

  const handleExport = () => {
    const data = tasks.map((task) => ({
      taskName: task.taskName,
      description: task.description,
      status: task.status,
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Tasks");
    writeFile(wb, "Tasks.xlsx");
  };

  return (
    <div style={{ padding: 16 }}>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Task
      </Button>
      <Button
        type="primary"
        onClick={handleExport}
        style={{ marginBottom: 16, marginLeft: 8 }}
      >
        Export to Excel
      </Button>
      <Table dataSource={tasks} rowKey="taskName">
        <Column title="Task Name" dataIndex="taskName" />
        <Column title="Description" dataIndex="description" />
        <Column title="Status" dataIndex="status" />
        <Column
          title="Action"
          render={(text, task) => (
            <>
              <Button type="primary" onClick={() => handleMove(task, "To Do")}>
                To Do
              </Button>
              <Button
                type="primary"
                onClick={() => handleMove(task, "In Progress")}
                style={{ marginLeft: 8 }}
              >
                In Progress
              </Button>
              <Button
                type="primary"
                onClick={() => handleMove(task, "Done")}
                style={{ marginLeft: 8 }}
              >
                Done
              </Button>
              <Button
                type="primary"
                onClick={() => handleUpdate(task)}
                style={{ marginLeft: 8 }}
              >
                Update
              </Button>
              <Button
                type="primary"
                onClick={() => handleDelete(task)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </Button>
            </>
          )}
        />
      </Table>
      <Modal
        title={isAdd ? "Add Task" : "Update Task"}
        visible={modalVisibility}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleSubmit} ref={formRef} initialValues={currentTask}>
          <Form.Item
            label="Task Name"
            name="taskName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
