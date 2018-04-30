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

  function display(){
   
    var query = connection.query(
        "select * from products",
        
        function(err, result) {
          if(err) throw err;
          console.table(result);
          start();
        }
      );
     
 }
  
 function start(){

 
  inquirer
  .prompt([

    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Quit"],
        name: "option"
      }

    ]).then(function(response) {
  
        if(response.option=="View Products for Sale")
        {
            productsforsale();
        }
        else if(response.option=="View Low Inventory")
        {
            lowinventory();
        }
        else if(response.option=="Add to Inventory")
        {
            addinventory();
        }
        else if(response.option=="Add New Product")
        {
            addnewproduct();
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
      function productsforsale()
      {
         connection.query("select * from products", function(err,result){
            if (err) throw err;
            console.log("Products Table:")
            console.table(result);
            
        });
        start();
      }
      function lowinventory()
      {
        connection.query("select * from products where stock_quantity < 5", function(err,result){
            if (err) throw err;
            console.log("Items with low inventory:")
            console.table(result);
        });
        start();
      }
      function addinventory()
      {
        connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
           
            inquirer
              .prompt([
                {
                  name: "choice",
                  type: "rawlist",
                  choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                  },
                  message: "Which item would you like to add inventory to?"
                },
                {
                  name: "add",
                  type: "input",
                  message: "How much would inventory would you like to add?"
                }
              ])
              .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                  if (results[i].product_name == answer.choice) {
                    chosenItem = results[i];
                  }
                }
        
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: parseFloat(chosenItem.stock_quantity) + parseFloat(answer.add)
                      },
                      {
                        id: chosenItem.id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                     
                    }
                  );
                  console.log("Inventory for item "+chosenItem.product_name+" updated successfully!");
                  display();
                  //start();
              });
          });
      }
      function addnewproduct()
      {
        
        inquirer
        .prompt([
          {
            name: "product_name",
            type: "input",
            message: "Which item would you like to add?"
          },
          {
            name: "department_name",
            type: "input",
            message: "Which department does this item belong to?"
          },
          {
            name: "price",
            type: "input",
            message: "What is the price of this item?"
          },
          {
            name: "stock_quantity",
            type: "input",
            message: "What is the current inventory of this item?"
          }
        ])
        .then(function(answer) {
           
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.product_name,
                  department_name: answer.department_name,
                  price: answer.price,
                  stock_quantity:answer.stock_quantity
                },
                function(err, result) {
                  if(err) throw err;
                }
              );
              console.log("Item added successfully!");
              display();
              //start();

  
        })
      }

      start();