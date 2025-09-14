using HotChocolate;
using HotChocolate.Subscriptions;
using Todo.Api.GraphQL.Types;

namespace Todo.Api.GraphQL.Subscriptions;

public class TaskSubscriptions
{
    [Subscribe]
    public TaskType OnTaskChanged([EventMessage] TaskType task) => task;
}
