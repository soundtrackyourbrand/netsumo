const Task = class Task {
constructor(options) {
    this.taskType = options.TaskType;
  }

  submit() {
    return Math.random().toString(36).substring(7);;
  }
}

module.exports = class NTask{
  constructor() {
    this.Task = Task;
    this.TaskType = {
      MAP_REDUCE: "mapreduce",
      SCHEDULED: "scheduled"
    }
  }
  create(options){
    return new Task(options);
  }
}
