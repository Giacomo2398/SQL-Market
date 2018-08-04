const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require('figlet');
const md5 = require("blueimp-md5");
const Table = require("cli-table");

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:'root',
    password: "Gfg020398*",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    firstcall();
});

function firstcall(){
    figlet('Welcome to Bamazon!', function(err, data){
        if (err) {
            console.log('Main screen was not able to load');
            console.dir(err);
            return;
        }
        console.log("-----------------------------------------------------------------------------------------------------\n");
        console.log(data)
        console.log("\n-----------------------------------------------------------------------------------------------------");
        inquirer.
        prompt({
            name: "User_visit",
            type: "list",
            message: "Would you like to Log in or Create Account?",
            choices: ["Log in", "Create Account"]
        }).then(function(answer){
            if(answer.User_visit === "Log in"){
                login();
            }else if(answer.User_visit === "Create Account"){
                createAccount();
            }
        });
    });

}

function login(){
    inquirer.prompt([
        {
            name:"email",
            type:'input',
            message:"Email:",
        },
        {
            name:"password",
            mask:"*",
            type:"password",
            message: "Password:"
        }
    ]).then(function(answer){
        let email = answer.email;
        let passwordHash = md5(answer.password);
        let user = [];
            connection.query("SELECT * FROM users", function(err, result){
                if(err) throw (err);
                for (var i = 0; i < result.length; i++){
                    if(email == result[i].Email && passwordHash == result[i].Password){
                        user.push(result[i]);
                    }
                }
                insidelogin(user);
                function insidelogin(user){
                    if(user != null){
                        console.log("\n-----------------------------------------------------------------------------------------------------");
                        console.log("                                   You are logged in as " + user[0].Username);
                        menuDisplay();
                    }else{
                        console.log("*Error: Please create an account first or try again*\n");
                        firstcall();
                    }
                }
        })
    })
}

function createAccount(){
    inquirer.prompt([
        {
            name:"email",
            type:'input',
            message:"Email:",
        },
        {
            name:"username",
            type:'input',
            message:"Username:",
        },
        {
            name:"password",
            mask:"*",
            type:"password",
            message: "Password:"
        },
        {
            name:"passwordCheck",
            mask:"*",
            type:"password",
            message: "Password:"
        }
    ]).then(function(answer){
        connection.query("SELECT * FROM users", function(err, result){
            if(err) throw err;
            Loop1: for (var i = 0; i < result.length; i++){
                if(answer.password == answer.passwordCheck && answer.email != result[i].Email && answer.username != result[i].Username){
                    let username = answer.username;
                    let email = answer.email;
                    let password = md5(answer.password);
                    let query = connection.query("INSERT INTO users SET ?",
                    {
                        Email: email,
                        Password: password,
                        Username: username,
                        Orders:0,
                    }, function(err, result){
                        if(err) throw err;
                        console.clear();
                        console.log("Thank you for creating an account! You are now logged in as: " + username);
                        menuDisplay();
                    }
                    )
                    query.sql;
                    break Loop1;
                }else{
                    console.clear();
                    console.log("Error: *Email is already in used or password does not match, please try again!*\n");
                    firstcall();
                    break Loop1;
                }
            }
        })
    })
};

function menuDisplay(){
let menu = new Promise(function secondCall(tableDisplay, reject){
    figlet("Product Menu", function (err, data){
        if(err) {
            console.log('Menu Product Banner was not able to load');
            console.dir(err);
            return;
        }
        console.log("\n-----------------------------------------------------------------------------------------------------");
        console.log(data);
        console.log("\n-----------------------------------------------------------------------------------------------------");
        console.log("\nThese are the items for sale:");
        // Connection to SQL for Products
        connection.query("SELECT * FROM products", function(err, result){
            if(err) throw err;
            let table = new Table({
                head: ["Product ID", "Name", "Price ($)", "In stock"],
                colWidths: [15,70,15,10]
            });
            for(var x = 0; x < result.length; x++){
                table.push(
                    [result[x].id, result[x].Product_name, result[x].Price, result[x].Stock_quantity]
                );
            }
            tableDisplay(console.log(table.toString()));
            console.log("\n-----------------------------------------------------------------------------------------------------");
        })
    })
});
// Displaying and calling the purchase function
menu.then(function(){
    itemFinder();
    })
};

// Purchase function
function itemFinder(){
    inquirer.prompt([
        {
            name:"ID",
            type:"input",
            message:"Please enter the ID of desired product:"
        },
        {
            name:"quantity",
            type:"input",
            message:"Input the desired quantity of the product chosen:"
        }
    ]).then(function(answer){
        let productId = answer.ID;
        let quantity = answer.quantity;
        connection.query("SELECT * FROM products", function(err, result){
            if(err) throw err;
            let itemArray = [];
            Loop2:
            for (var x = 0; x < result.length; x++){
                if(productId > 11 || answer.ID == ""){
                    console.log("\n*Please choose an item from the list*");
                    menuDisplay();
                    break Loop2;
                }else if(productId == result[x].id){
                    itemArray.push(result[x]);
                    orderProcess(itemArray);
                }
            }


        });
        function orderProcess(itemArray){
            if(quantity <= itemArray[0].Stock_quantity){
                let price = itemArray[0].Price;
                confirmation(productId, quantity, price);
            }else{
                console.log("\nSorry we currently do not have that quantity in stock or the password is incorrect. Please try again\n");
                inquirer.prompt([
                {
                    name:"return",
                    type:"confirm",
                    message:"Return to product menu?"
                }
                ]).then(function(answer){
                    if(answer.return === true){
                        menuDisplay();
                    }else{
                        process.exit();
                    }
                })
            }
        }
    })
}

function confirmation(ID, amount, price){
    let total = parseInt(amount) * parseInt(price);
    console.log("Your total for this purchase is: $" + total);
    console.log("Please provide the following information to finish this purchase:");
    inquirer.prompt([
        {
            name:"username",
            type:'input',
            message:"Username:",
        },
        {
            name:"purchaseConfirmation",
            type:"password",
            mask:"*",
            message:"Password: ",
        }
        ]).then(function(answer){
            let password = md5(answer.purchaseConfirmation);
            let username = answer.username;
            connection.query("SELECT * FROM users WHERE ?",
            [
                {
                    Username: username
                }
            ], function(err, result){
                if (err) throw err; 
                let userArray = [];
                    if(password == result[0].Password){
                        userArray.push(result[0]);
                    }else{
                        console.log("\nThe information provided was not correct, try again");
                        menuDisplay();
                    }
                updateStore(userArray);
            })
        });

        function updateStore(userArray){
            let newOrders = userArray[0].Orders + 1;
            let password = userArray[0].Password;
            let userUpdate = connection.query("UPDATE users SET ? WHERE ?", 
                [
                    {
                        Orders: Number(newOrders)
                    },
                    {
                        Password: password
                    }
                ],
                function(err, result){
                    if(err) throw err;
                        let output = console.log("You have placed your order. Thank you for your purchase!");
                        menu(output);
                    })

            let changingStock = connection.query("UPDATE products SET Stock_quantity = Stock_Quantity - " + amount + " WHERE ?", 
                [
                    {
                        id: Number(ID)
                    }
                ],
                function(err, result){
                    if(err) throw err;
                })
            userUpdate.sql;
            changingStock.sql;
            
        }
};

function menu(){
    inquirer.prompt([
        {
            name:"return",
            type:"confirm",
            message:"Return to product menu?"
        }
        ]).then(function(answer){
            if(answer.return === true){
                menuDisplay();
            }else{
                process.exit();
            }
        })
}