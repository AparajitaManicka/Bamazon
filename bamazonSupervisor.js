var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  
 function start(){

 
  inquirer
  .prompt([

    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department","Quit"],
        name: "option"
      }

    ]).then(function(response) {
  
        if(response.option=="View Product Sales by Department")
        {
            viewproductsalesbydept();
        }
        else if(response.option=="Create New Department")
        {
            createnewdept();
        }
        else if(response.option=="Quit")
        {
            quit();
        }
      });
    }
      function quit(){
          console.log("Thank you!");
          connection.end();
      }
      function viewproductsalesbydept()
      {
        connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales,(departments.over_head_costs-products.product_sales) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name ORDER BY departments.department_id",
        function(err,result){
            if (err) throw err;
            console.log("Joint Table:")
            console.table(result);

        });
        start();
      }
     

      function createnewdept()
      {
      inquirer
        .prompt([
          {
            name: "department_id",
            type: "input",
            message: "What is the department id that you would to add?"
          },
          {
            name: "department_name",
            type: "input",
            message: "What is the name of the department?"
          },
          {
            name: "over_head_costs",
            type: "input",
            message: "What is the over_head_costs of this department?"
          }
        ])
        .then(function(answer) {
           
            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                  department_id: answer.department_id,
                  department_name: answer.department_name,
                  over_head_costs: answer.over_head_costs
                },
                function(err, result) {
                  if(err) throw err;
                }
               
              );
                console.log("Department added successfully!");
                

                


              display();

  
        })
     
    }

      start();

      function display(){
   
        var query = connection.query(
            "select * from departments",
            
            function(err, result) {
              if(err) throw err;
              console.table(result);
              start();
            }
          );
         
     }