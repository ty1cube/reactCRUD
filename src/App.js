import React, {Component} from 'react';
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';
import loadingGif from './loading.gif';



class App extends Component {

constructor(){

  super();

  this.state = {
    newTodo: '',
    editing: false,
    editingIndex: null,
    notification: null,
    todos:[],
    loading: true
}

 this.apiUrl= 'https://5ce7d0509f2c390014dba305.mockapi.io'

  this.handleChange = this.handleChange.bind(this)
  this.addTodo = this.addTodo.bind(this)
  this.deleteTodo = this.deleteTodo.bind(this)
  this.editTodo = this.editTodo.bind(this)
  this.updateTodo = this.updateTodo.bind(this)
  //this.generateTodoId = this.generateTodoId.bind(this)
  this.alert = this.alert.bind(this)
}


async componentDidMount(){
  const response = await axios.get(`${this.apiUrl}/Todo`)

   setTimeout(()=>{
    this.setState({
      todos: response.data,
      loading: false
    })}, 1000)
 
  //console.log(response)
    //console.log("I mounted!!!")
}

componentWillMount(){
  console.log("I will mount")
}

handleChange(event){

  this.setState({
    newTodo: event.target.value
  });

  //console.log(event.target.name, event.target.value)
}


async addTodo(){

  // const newTodo = {
  //   name: this.state.newTodo,
  //   id: this.generateTodoId() 
  // }

  const response = await axios.post(`${this.apiUrl}/Todo`, {name:this.state.newTodo})
  //console.log(response)
  
  const todos = this.state.todos
  todos.push(response.data)

  this.setState({
    todos: todos,
    newTodo: ''
  })

  this.alert('Todo created successfully.')
}


async deleteTodo(index){

  const todos = this.state.todos
  const todo = todos[index]

   await axios.delete(`${this.apiUrl}/Todo/${todo.id}`)

  delete todos[index]

  this.setState({
    todos: todos
  })

  this.alert('Todo deleted successfully.')
}


editTodo(index){

  const todo = this.state.todos[index]
   this.setState({
     editing:true,
     newTodo:todo.name,
     editingIndex:index
   })
}

async updateTodo(){

  const todo = this.state.todos[this.state.editingIndex]

  //todo.name = this.state.newTodo

  const response = await axios.put(`${this.apiUrl}/Todo/${todo.id}`,
  {name: this.state.newTodo})
    //console.log(response)

  const todos = this.state.todos
  todos[this.state.editingIndex] = response.data

  this.setState({
    todos:todos,
    editing:false,
    editingIndex: null,
    newTodo: ''
  })

  this.alert('Todo updated successfully.')

}

// generateTodoId(){
//   const lastTodo = this.state.todos[this.state.todos.length -1]
//   if(lastTodo){
//     return lastTodo.id +1
//   }
//   return 1
// }


alert(notification){

  this.setState({
    notification:notification
  })

  setTimeout(()=>{
    this.setState({
      notification:null
    })
  }, 2000)
}


render(){

    //console.log(this.state.newTodo)

    return (
      <div className="App">
   
        <div className="container">

          {
            this.state.notification &&

            <div className= "alert alert-success mt-4">
            <p className="text-center">{this.state.notification}</p>
          </div>
          }

          <h1 className = "text-center p-4"> Todos  App</h1>

          
          <input 
          type ="text" 
          name ="todo"
          className ="my-4 form-control" 
          placeholder = "Add a new todo"
          onChange = {this.handleChange}
            value={this.state.newTodo}
          />

          <button 
          className = "btn-success mb-4 form-control"
          onClick = {this.state.editing?this.updateTodo:this.addTodo}
          disabled= {this.state.newTodo.length < 5}>
          
          {this.state.editing? 'Update Todo': 'Add Todo'}
          </button>

          {
            this.state.loading &&

            <img src= {loadingGif}  alt = ""/>
          }

   {
     (!this.state.editing || this.state.loading) &&

     <ul className ="list-group">
          {this.state.todos.map((item, index)=>{

          return <ListItem
            key ={item.id}
            item = {item}
            editTodo= {()=>{
              this.editTodo(index)
            }}
            deleteTodo ={()=>{
              this.deleteTodo(index)
            }}
          />
          })}
         </ul>
   }
  
        </div>
  
      </div>
    )

  };
}

export default App;
