import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const App = () => {
  const [currentTodo, setCurrentTodo] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/todos");
      return response.data;
    },
  });

  const AddTodo = useMutation({
    mutationFn: async (todo) => {
      const response = await axios.post("http://localhost:3000/todos", todo);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      alert("Thêm sản phẩm thành công");
      reset();
    },
    onError: () => {
      alert("Thêm sản phẩm thất bại");
    },
  });

  const Remove = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      alert("Xóa sản phẩm thành công");
    },
    onError: () => {
      alert("Xóa sản phẩm thất bại");
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (updatedTodo) => {
      const response = await axios.put(
        `http://localhost:3000/todos/${updatedTodo.id}`,
        updatedTodo
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setCurrentTodo(null);
    },
    onError: () => {
      alert("Cập nhật sản phẩm thất bại");
    },
  });

  const onHandleSubmit = (data) => {
    AddTodo.mutate({ ...data, completed: false });
  };

  const onHandleSave = (data) => {
    if (!currentTodo) return;
    updateTodoMutation.mutate({
      ...currentTodo,
      title: data["title-update"],
    });
  };

  const toggleChecked = (todo) => {
    updateTodoMutation.mutate({ ...todo, completed: !todo.completed });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-md">
        {/* Them */}
        <h2 className="text-xl font-bold mb-4 text-center">Thêm công việc</h2>
        <form onSubmit={handleSubmit(onHandleSubmit)} className="flex gap-2 mb-4">
          <input type="text" {...register("title")} placeholder="Nhập công việc..." className="flex-1 p-2 border rounded-md" />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Submit
          </button>
        </form>
        {/* Danh Sach */}
        <h2 className="text-xl font-bold mb-4 text-center">Danh sách công việc</h2>
        <ul className="space-y-2">
          {data?.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm">
              <input type="checkbox" checked={todo.completed} onClick={() => toggleChecked(todo)} className="mr-2" />
              {currentTodo?.id === todo.id ? (
                <form onSubmit={handleSubmit(onHandleSave)} className="flex items-center gap-2 flex-1">
                  <input type="text" {...register("title-update")} className="flex-1 p-2 border rounded-md" />
                  <button type="submit" className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600">
                    Save
                  </button>
                  <button type="button" onClick={() => setCurrentTodo(null)} className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span
                    onClick={() => { reset({ "title-update": todo.title }); setCurrentTodo(todo); }}
                    className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {todo.title}
                  </span>
                  <button onClick={() => Remove.mutate(todo.id)} className="bg-red-500 text-white py-1 px-3 rounded-md">
                    Delete
                  </button>
                </>

              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
