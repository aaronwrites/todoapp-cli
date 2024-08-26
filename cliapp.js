const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

let todos = "./todos.json"
program
  .name('todoApp CLI')
  .description('CLI to manage your tasks')
  .version('1.0.0');


program.command('list')
  .description('Lists all the todos')
  .action(() => {
    const jsondata = fs.readFileSync(todos, "utf-8");
    if (JSON.parse(jsondata).length === 0) {
      console.log("No Todos to display.");
      return;
    }
    console.log("List of Todos");
    JSON.parse(jsondata).forEach(todo => {
      console.log(`${todo.id}. ${todo.task} - Status: ${todo.isCompleted?"Completed":"Pending"}`);
    });
  });

program.command('add')
  .description('Adds a todo')
  .argument('todo', 'todo to be added')
  .action((task) => {
    const jsondata = fs.readFileSync(todos, "utf-8");
    const parsedData = JSON.parse(jsondata);
    const todo = {"id": `${parsedData.length+1}`, "task": task, "isCompleted": false};
    parsedData.push(todo);

    fs.writeFile(todos, JSON.stringify(parsedData, null, 2), () => {
      console.log(`TODO - ${todo.task} added successfully.`)
    })
  })

program.command('delete')
  .description('Deletes a todo')
  .argument('id', 'id of the todo to be added')
  .action((id) => {
    const jsondata = fs.readFileSync(todos, "utf-8");
    const parsedData = JSON.parse(jsondata);
    parsedData.splice(id-1, 1);
    for (let ind = 0; ind<parsedData.length; ind++) {
      parsedData[ind].id = ind+1;
    }
    fs.writeFile(todos, JSON.stringify(parsedData, null, 2), () => console.log("TODO deleted successfully"));
  })

program.command('complete')
  .description('Marks a todo as complete')
  .argument('id', 'id of the todo to be marked as complete')
  .action((id) => {
    const jsondata = fs.readFileSync(todos, "utf-8");
    const parsedData = JSON.parse(jsondata);
    parsedData[id-1].isCompleted = true;
    fs.writeFile(todos, JSON.stringify(parsedData, null, 2), ()=> console.log(`${parsedData[id-1].task} is marked complete!`));
  })
 
  program.command('rename')
  .description('Rename a todo')
  .argument('currentname', 'current name of the todo')
  .argument('newname', 'new name of the todo')
  .action((currName, newName) => {
    const jsondata = fs.readFileSync(todos, "utf-8");
    const parsedData = JSON.parse(jsondata);
    parsedData.forEach((todo, index) => {
      if (todo.task === currName) {
        todo.task = newName;
      }
    })

    fs.writeFile(todos, JSON.stringify(parsedData, null, 2), () => {
      console.log(`TODO updated successfully.`)
    })
  })

program.parse();
