'use strict';

// Get a reference to the dropdown list with the id "classificationList"
let classificationList = document.querySelector("#classification_id");

// Add an event listener to the dropdown list to detect changes
classificationList.addEventListener("change", function () {

  // Get the selected value (classification_id) from the dropdown
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);

  // Build the URL for fetching inventory items based on the selected classification_id
  let classIdURL = "/inv/getInventory/" + classification_id;

  // Use the Fetch API to make an asynchronous request to the server
  fetch(classIdURL)
    .then(function (response) {
      // Check if the network response is successful (status code 2xx)
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data); // Log the retrieved data
      // Assuming there's a function named buildInventoryList, call it to handle the retrieved data
      buildInventoryList(data);
    })
    .catch(function (error) {
      // Handle any errors that occurred during the fetch operation
      console.log('There was a problem: ', error.message);
    });
});

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.inv_id + ", " + element.inv_model); 
     dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
     dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
   }