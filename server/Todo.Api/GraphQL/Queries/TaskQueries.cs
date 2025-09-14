using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.GraphQL.Types;

namespace Todo.Api.GraphQL.Queries;

public class TaskQueries
{
    public async System.Threading.Tasks.Task<IEnumerable<TaskType>> GetAllTasks(TodoDbContext context)
    {
        var tasks = await context.Tasks
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(t => new TaskType
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt
        });
    }
}
