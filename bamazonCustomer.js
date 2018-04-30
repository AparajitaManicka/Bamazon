var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require('console.table');
var chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    display();
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

function start() {
   
    inquirer
        .prompt([

            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Purchase a product", "Quit"],
                name: "option"
            }

        ]).then(function (response) {

            if (response.option == "Purchase a product") {
                purchase();
            }

            else if (response.option == "Quit") {
                quit();
            }
        });
}
function quit() {
    console.log("Thank you!");
    connection.end();
}


function purchase() {
  
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What is the ID of the product you would like to buy?",
                    name: "id"
                },
                {
                    type: "input",
                    message: "How many units of the product would you like to buy?",
                    name: "qty"
                }
            ])
            .then(function (inquirerresponse) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id == inquirerresponse.id) {
                        chosenItem = results[i];
                    }
                }


                if (chosenItem.stock_quantity > parseInt(inquirerresponse.qty)) {
                    connection.query(
                        "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE id = ?",
                        [chosenItem.stock_quantity - inquirerresponse.qty, chosenItem.product_sales + (chosenItem.price * inquirerresponse.qty), chosenItem.id],
                        //   [{stock_quantity: chosenItem.stock_quantity - inquirerresponse.qty},{id: chosenItem.id}],

                        function (error) {
                            if (error) throw err;

                        }
                    );


                    console.log("Order placed successfully!")
                    console.log("Total price of purchase: " + chosenItem.price * inquirerresponse.qty);
                   display();
                   
                }
                else {
                    console.log("Insufficient quantity!");
                    display();
                   
                }

            })

  
        })
}
// read();
 
