import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import customFetch from "./utils"
import { toast } from "react-toastify"

export const useFetchTasks = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await customFetch.get("/")
      return data
    }
  })
  return { isLoading, isError, data }
}

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient()

  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (tasKTitle) => customFetch.post("/", { title: tasKTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("task added")
    },
    onError: (error) => {
      toast.error(error.response.data.msg)
    }
  })
  return { createTask, isLoading }
}

// Edit task
export const useEditTask = () => {
  const queryClient = useQueryClient()

  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) => {
      return customFetch.patch(`/${taskId}`, { isDone })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
  return { editTask }
}

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteTask, isLoading: deleteTaskLoading } = useMutation({
    mutationFn: (taskId) => {
      return customFetch.delete(`/${taskId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
  return { deleteTask, deleteTaskLoading }
}
