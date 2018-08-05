# BAMAZON
## Description
Bamazon is a CLI market that utilizes MySQL and different npm packages to recieve client orders and retrieves products from the store's inventory.Before starting the market, the file bamazon.sql contains the steps to create the inventory for the market, as well as giving the user a sort of products. 

Bamazon offers a customer version of the market, as well as, a manager version which allows the user to have further interaction with the inventory.

## Using Bamazon
## Running npm install
This application uses different npm modules for both functionallity and appearance of the market overall. The following modules are the ones used on the market:
* bluimp-md5, for password hashing
* inquirer, for user interaction
* mysql, database connection
* cli-table, for design
* figlet, for design

### Functionalities
### Being a Customer!
* To access the market as a customer run ```node bamazonCustomer.js````
![Opening Command for Customer](/Images/1.png)
* After creating an account with the assistance of the prompts, access to the market is avaliable.
![Market Login & Product Table](/Images/2.png)

### Being a Manager!
* To gain access to the market as a manager run ```node bamazonManager.js```
![Openning Command for Manager](/Images/3.png)
* The loading screen for managers is disctinct to the customer because there is no option to create account. Instead a user most be manually added to the managers datable.
![Manager Login](/Images/4.png)
*Once access is given, the manager menu contains 5 command prompts:
* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product
* Exit
![Manager Menu](/Images/5.png)

* With these tools managers can have an easy access to the market's inventory.