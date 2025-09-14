using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.GraphQL.Types;
using Todo.Api.Models;

namespace Todo.Api.GraphQL.Mutations;

public class TaskMutations
{
    public async System.Threading.Tasks.Task<TaskType> CreateTask(
        CreateTaskInput input,
        TodoDbContext context,
        ITopicEventSender eventSender)
    {
        var task = new Models.Task
        {
            Title = input.Title,
            Description = input.Description,
            Status = Models.TaskStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var taskType = new TaskType
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

        await eventSender.SendAsync("onTaskChanged", taskType);

        return taskType;
    }

    public async System.Threading.Tasks.Task<TaskType?> UpdateTaskStatus(
        UpdateTaskStatusInput input,
        TodoDbContext context,
        ITopicEventSender eventSender)
    {
        var task = await context.Tasks.FindAsync(input.Id);
        if (task == null)
            return null;

        task.Status = input.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var taskType = new TaskType
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

        await eventSender.SendAsync("onTaskChanged", taskType);

        return taskType;
    }
}
