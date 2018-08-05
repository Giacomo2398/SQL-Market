require("dotenv").config();

const keys = require('./keys.js');
const mysql = require("mysql");
const inquirer = require("inquirer");
const figlet = require('figlet');
const md5 = require("blueimp-md5");
const Table = require("cli-table");

var connection = mysql.createConnection({
    host:"localhost",
    port: process.env.SQL_PORT || 3306,
    user:'root',
    password: process.env.SQL_Password,
    database: process.env.SQl_Database
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
        console.log("Manager Access!")
        inquirer.
        prompt({
            name: "User_visit",
            type: "list",
            message: "Manager Log in",
            choices: ["Log in"]
        }).then(function(answer){
            if(answer.User_visit === "Log in"){
                login();
            }
        });
    });

};

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
            connection.query("SELECT * FROM managers", function(err, result){
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
                        managerAccess();
                    }else{
                        console.log("*Error: Please contact support for manager access*\n");
                        firstcall();
                    }
                }
            })
    })
}

function managerAccess(){
    console.clear();
        let menu = new Promise(function display(resolve, reject){
            figlet("Manager Menu", function (err, data){
            if(err) {
                console.log('Manager Menu Banner was not able to load');
                console.dir(err);
                return;
            }
            console.log("\n-----------------------------------------------------------------------------------------------------");
            console.log(data);
            console.log("\n-----------------------------------------------------------------------------------------------------");
            resolve('Succes!');
            })
        });
        menu.then(function() {
            inquirer.
            prompt({
                name: "Manager_menu",
                type: "list",
                message: "Please select from the menu: ",
                choices: ["View Products for Sale","View Low Inventory", "Add to Inventory","Add New Product","Exit"]
            }).then(function(answer){
                if(answer.Manager_menu === "View Products for Sale"){
                    menuDisplay();
                }else if(answer.Manager_menu === "View Low Inventory"){
                    lowInventory();
                }else if(answer.Manager_menu === "Add to Inventory"){
                    addInvetory();
                }else if(answer.Manager_menu === "Add New Product"){
                    addProduct();
                }else if(answer.Manager_menu === "Exit"){
                    process.exit();
                }
            })
        })
}

function back(){
    inquirer.
    prompt({
        name:"Return",
        type:"confirm",
        message:"Go back to the Manager Menu?"
    }).then(function(answer){
        if(answer.Return === true){
            managerAccess();
        }else{
            process.exit();
        }
    })
}

function menuDisplay(){
    let menu = new Promise(function secondCall(tableDisplay, reject){
        figlet("Products", function (err, data){
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
    // Displaying menu
    menu.then(function(){
        back();
        })
}; 

function lowInventory(){
    console.log("LOW INVENTORY! RESTOCK NOW!!!!")
    console.log("\n-----------------------------------------------------------------------------------------------------");
    let query = connection.query("SELECT * FROM products WHERE Stock_quantity < 5", function(err, result){
        if(err) throw err;
        let table = new Table({
            head: ["Product ID", "Name", "Price ($)", "In stock"],
            colWidths: [15,70,15,10]
        });
        for(let z = 0; z < result.length; z++){
            table.push(
                [result[z].id, result[z].Product_name, result[z].Price, result[z].Stock_quantity]
            );
        }
        console.log(table.toString());
        console.log("\n-----------------------------------------------------------------------------------------------------");
        back();
    })
    query.sql;
};

function addInvetory(){
    console.log("Which Items would you like to restock?");
    let query = connection.query("SELECT * FROM products", function(err, result){
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
        console.log(table.toString());
        console.log("\n-----------------------------------------------------------------------------------------------------");
        inquire();
    })
    query.sql;

    function inquire(){
        inquirer.prompt([
            {
                name:"ID",
                type:"input",
                message:"Please enter the ID of product to be restock:"
            },
            {
                name:"amount",
                type:"input",
                message:"How many do you want to add?"
            }
        ]).then(function(answer){
            let id = answer.ID;
            let amount = answer.amount;
            connection.query("UPDATE products SET Stock_quantity = Stock_quantity + " + amount + " WHERE id = " + id, function(err,result){
                if(err) throw(err);
                if(result != null){
                    inquirer.
                    prompt([
                    {
                        name:"restock",
                        type:"confirm",
                        message: "Do you want to add a different product? \n-----------------------------------------------------------------------------------------------------"
                    }
                    ]).then(function(answer){
                        if(answer.restock == true){
                            inquire();
                            return;
                        }else{
                            back();
                        }
                    })
                }
            })
        })
    }
};

function addProduct(){
    console.log("-----------------------------------------------------------------------------------------------------");
    console.log("Add more products to your menu here!");
    inquirer.prompt([
        {
            name:"Product_name",
            type:"input",
            message:"Product Name: "
        },
        {
            name:"Department_name",
            type:"list",
            message:"Select Department: ",
            choices: ["Groceries","Electronics","Men's Apparel","Women Apparel","Home & Kitchen", "Other"]
        },
        {
            name:"Price",
            type:"input",
            message:"Product Price: "
        },
        {
            name:"Stock",
            type:"input",
            message:"Stock_quantity: "
        },
        {
            name:"question",
            type:"confirm",
            message:"Do you wish to add another item after this one?"
        }
    ]).then(function(answer){
        let name = answer.Product_name;
        let department = answer.Department_name;
        let price = answer.Price;
        let quantity = answer.Stock;
        let question = answer.question;
        connection.query("INSERT INTO products (Product_name, Department_name, Price, Stock_quantity) " + 
                        "VALUES ('" + name + "' , '" + department + "' , '" + price + "' , '" + quantity + "')",
        function(err,result){
            if (err) throw err;
            console.log("-----------------------------------------------------------------------------------------------------");
            console.log("Product added");
            console.log("-----------------------------------------------------------------------------------------------------");
            if(question == true){
                addProduct();
            }else{
                back();
            }
        });
    })
}