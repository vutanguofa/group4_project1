// Start of address validation function
function validateAddress() {
    var apiKey = "av-219b5d3a55b7bab918373de09c364935";
    //var apiKey = "";

    // Declaing variables
    var customerName = document.querySelector('#customerName').value;
    var streetAddress = document.querySelector('#streetAddress').value;
    var city = document.querySelector('#city').value;
    var state = document.querySelector('#state').value;
    var postalCode = document.querySelector('#postalCode').value;
    var countryCode = document.querySelector('#countryCode').value;
    // Creating a variable to store the order amount
    var orderAmt = parseFloat(document.querySelector('#orderAmt').value);
    var shipAmt = parseFloat(5.00);
    var orderTotal = orderAmt + shipAmt;
    var maskColor = document.querySelector('#maskColor').value;

    // Storing variable to local storage
    localStorage.setItem("customerName", customerName);
    localStorage.setItem("streetAddress", streetAddress);
    localStorage.setItem("city", city);
    localStorage.setItem("state", state);
    localStorage.setItem("postalCode", postalCode);
    localStorage.setItem("countryCode", countryCode);
    localStorage.setItem("orderAmt", orderAmt);
    localStorage.setItem("shipAmt", shipAmt);
    localStorage.setItem("orderTotal", orderTotal);
    localStorage.setItem("maskColor", maskColor);
    // End of local storage

    // Shipping address API
    fetch('https://cors-anywhere.herokuapp.com/https://api.address-validator.net/api/verify?StreetAddress=' + streetAddress +
        '&City=' + city +
        '&State=' + state +
        '&PostalCode=' + postalCode +
        '&CountryCode=' + countryCode +
        '&APIKey=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Details from address validator API: " + data);
            console.log("Shipping address is: " + data.status);
            if (data.status === "VALID") {
                $("#validationStatus").attr("style", "background-color: #58ce7b").text("Valid address.");
                $("#paypal-button-container").show();
            } else {
                $("#validationStatus").attr("style", "background-color: #fc665e").text("Invalid address. Please correct your shipping address.");
                //$("#paypal-button-container").show();
            };
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
// End of address validation function

// Hide PayPal button until address validation is successful"
$("#paypal-button-container").hide();

// Start of PayPal create order API
paypal.Buttons({
    style: {
        color: 'blue',
        shape: 'pill',
        label: 'pay',
        height: 40
    },
    createOrder: function (data, actions) {
        return actions.order.create({
            application_context: {
                brand_name: 'Group Four',
            },
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: localStorage.getItem("orderTotal"),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: localStorage.getItem("orderAmt")
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: localStorage.getItem("shipAmt")
                            }
                        }
                    },
                    items: [
                        {
                            name: 'Face Masks',
                            description: localStorage.getItem("maskColor"),
                            sku: 'sku01',
                            unit_amount: {
                                currency_code: 'USD',
                                value: localStorage.getItem("orderAmt")
                            },
                            quantity: '1',
                            category: 'PHYSICAL_GOODS'
                        },
                    ],
                    shipping: {
                        name: {
                            full_name: localStorage.getItem("customerName"),
                        },
                        address: {
                            address_line_1: localStorage.getItem("streetAddress"),
                            //address_line_2: data.addressline2,
                            admin_area_2: localStorage.getItem("city"),
                            admin_area_1: localStorage.getItem("state"),
                            postal_code: localStorage.getItem("postalCode"),
                            country_code: "US"
                        }
                    }
                }
            ]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            console.log("Details from PayPal API: ", details);
            $("#productSection").hide();
            //$("#checkoutMenu").hide();
            $("#confirmation").text("Thank you for your order! Your package will arrive within 3 to 5 business days.");
            $("#paypal-button-container").hide();
        });
    },
    onCancel: function (data, actions) {
        console.log('user cancelled-', data);
    },
    onError: function (data, actions) {
        console.log('error occured-s', data);
        var error = data;
        alert(error);
    }
}).render('#paypal-button-container');
//End of PayPal button

// Get local storage details for shipping address
// localStorage.getItem("customerName");
// console.log("This is: " + customerName);
// localStorage.getItem("streetAddress");
// console.log(streetAddress);
// localStorage.getItem("city");
// console.log(city);
// localStorage.getItem("state");
// console.log(state);
// localStorage.getItem("postalCode");
// console.log(postalCode);
// localStorage.getItem("countryCode");
// console.log(countryCode);