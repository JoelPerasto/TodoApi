/* global $ */
$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)
    
    $('#todoInput').keypress(function(event){
        if(event.which == 13){
            //create todo
            createTodo();
        }
    });
    
    $('.list').on('click', 'li', function() {
        updateTodo($(this));
    })
    
    $('.list').on('click', 'span', function(e){
        //propagation prevents bubbling
        e.stopPropagation();
        removeTodo($(this).parent());
    })
});

function addTodos(todos) {
    //add todos to page here
    todos.forEach(function(todo){
       addToDo(todo)
    });
}

function addToDo(todo){
       var newTodo = $('<li class="task">' + todo.name +'<span>X</span></li>');
       newTodo.data('id', todo._id);
       newTodo.data('completed', todo.completed);
       if(todo.completed){
           newTodo.addClass("done")
       }
       $('.list').append(newTodo);
}

function createTodo(){
    //send request to create new todo
    var userInput = $('#todoInput').val();
    $.post('/api/todos', {name: userInput})
    .then(function(newTodo){
        $('#todoInput').val('');
        addToDo(newTodo);
    })
    .catch(function(err){
        console.log(err);
    })
}

function removeTodo(todo){
    var clickedId = todo.data('id');
    var deleteUrl = '/api/todos/' + clickedId;
    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(function(data){
        todo.remove();
    })
    .catch(function(err){
        console.log(err);
    });
}
// not working 
function updateTodo(todo){
    var updateUrl = '/api/todos/' + todo.data('id');
    var isDone = !todo.data('completed');
    var updateData = {completed: isDone}
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updatedTodo){
        todo.toggleClass("done");
        todo.data('completed', isDone)
    })
    .catch(function(err){
        console.log(err);
    });
}
