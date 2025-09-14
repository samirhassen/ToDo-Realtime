using Todo.Api.Models;

namespace Todo.Api.GraphQL.Types;

public class TaskType
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Models.TaskStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTaskInput
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateTaskStatusInput
{
    public int Id { get; set; }
    public Models.TaskStatus Status { get; set; }
}
